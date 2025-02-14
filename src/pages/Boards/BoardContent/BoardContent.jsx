
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
// import { mapOrder } from '~/utils/sorts'
import { cloneDeep, isEmpty } from 'lodash'
import {
  DndContext,
  // MouseSensor,
  // PointerSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndkitSensors'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import TrelloCard from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceholderCard } from '~/utils/formatters'

export default function BoardContent({ board, createNewColumn,
  createNewCard, moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferenColumn,
  deleteColumnDetails }) {

  const [orderedColumns, setOrderedColumns] = useState([])
  const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
  }
  // cùng 1 thời điểm chỉ có một phần tử được kéo là COLUMN hoặc CARD
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  // điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạn)
  const lastOverId = useRef(null)
  const sensors = useSensors(
    // useSensor(PointerSensor, {
    //   activationConstraint: { distance: 10 }
    // }),
    useSensor(MouseSensor, {
      // yêu cầu chuột di chuyển khoản 10px mới gọi event, fix trừơng hợp click bị gọi event
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(TouchSensor, {
      // nhấn giữ 250ms và dung sai của cảm ứng = 500px thì mới kích hoạt event, fix trên mobi
      activationConstraint: {
        delay: 250,
        tolerance: 500
      }
    })
  )
  useEffect(() => {
    // setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
    setOrderedColumns(board.columns)

  }, [board])

  // tìm column theo id card
  const findcolumnbyCardId = (cardId) => {
    //hàm find()trả về phần tử đầu tiên thỏa mãng điều kiện được cung cấp
    //trong hàm callback, nếu không thỏa mãng điều kiện sẽ trả về 'undefined',
    //column?.cards Sử dụng toán tử optional chaining
    // (?.) để đảm bảo rằng column và column.cards tồn tại trước khi tiếp tục.
    //.map(card => card._id) tạo ra một mãng mới chứa tất cả giá trị _id có trong card[]
    // kiểm tra card[_id] tồn tại trước khi tiếp tục dùng hàm includes Kiểm tra xem cardId
    // có tồn tại trong mảng các _id hay không. Nếu tồn tại, điều kiện sẽ thỏa mãn.
    return orderedColumns.find(column => column?.cards.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      // tìm ra vị trí index của overCard trong cards[] đích nơi active sắp được thả
      const overCardIndex = overColumn.cards?.findIndex(card => card._id === overCardId)
      // logic tính toán cardIndex mới (trên hoặc dưới overCard) code chuẩn được lấy ra từ thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top >
        over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      // clone mãng orderedcolumnsState cũ ra một mãng mới để xử lý data rồi return
      //và cập nhật lại orderedColumnState
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        // xóa card ở column cũ
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // thêm placeholder Card nếu cards rỗng : khi kéo hết card trong listcard
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]

        }
        // cập nhật lại mãng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      if (nextOverColumn) {
        // kiểm tra card đang kéo có tồn tại trong overColumn hay không nếu có thì loại bỏ nó trước khi sắp xếp lại mãng card
        nextOverColumn.cardOrderIds = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        /* phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card*/
        const rebuildActiveDragItemData = {
          // ...activeDragItemData,
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuildActiveDragItemData)

        //xóa thẻ card Placeholdercard nếu nó đang tồn tại,việc này tránh gửi nhầm dữ liệu về BE
        // placeholderCard là thẻ do FE tạo ra nhằm mục đích fix bug kéo card khi card rỗng
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        //cập nhật lại mãng orderedCardIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      // console.log('nextOverColumn:', nextOverColumn)
      // console.log('isBelowOverItem', isBelowOverItem)
      // console.log('modifier', modifier)
      // console.log('newCardIndex', newCardIndex)

      // nếu funs này được gọi từ handleDragEnd nghĩa là thì kéo thả xong, lúc này mới xử lý gọi Api 1 lần ở đây
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferenColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
      }
      console.log('set board khi kéo card sang column khác')
      console.log('🚀 ~ nextColumns:', nextColumns)
      return nextColumns
    })

  }
  // sự kiện khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findcolumnbyCardId(event?.active?.id))
    }
  }
  //sự kiện khi đang trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    console.log('hành động handleDragOver:')
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    console.log('🚀 ~ handleDragOver ~ over:', over)
    console.log('🚀 ~ handleDragOver ~ active:', active)

    // nếu active hoặc over không tồn tại hoặc kéo ra ngoài phạm vi container thì sẽ return tránh lỗi
    if (!active || !over) return
    // activeDraggingCard là cái card đang được kéo
    // const { id: activeDraggingCardId } = active
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overDraggingCard cái card đang được tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    const activeColumn = findcolumnbyCardId(activeDraggingCardId)
    const overColumn = findcolumnbyCardId(overCardId)
    console.log('🚀 ~ handleDragOver ~ overColumn:', overColumn)
    // kiểm tra 1 trong 2 nếu không tồn tại thì không làm gì hết
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      console.log('handleDragOver')
      // phải gọi moveCardBetweenDifferentColumns ở handleDragOver và handleDragEnd nếu không sẽ gặp lỗi không có card giữ chổ
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }

  }
  // sự kiện khi kết thúc quá trình kéo một phần tử
  const handleDragEnd = (event) => {
    console.log('hành động handleDragEnd:')
    // console.log('đang thực hiện hành động kéo thả CARD')
    const { active, over } = event
    console.log('🚀 ~ handleDragEnd ~ active:', active)
    console.log('🚀 ~ handleDragEnd ~ over:', over)

    // nếu active hoặc over không tồn tại hoặc kéo ra ngoài phạm vi container thì sẽ return tránh lỗi
    // logic sẽ được xử lý nếu vị trí kéo và thả khác nhau
    if (!active || !over) return
    // xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // const { id: activeDraggingCardId } = active
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overDraggingCard cái card đang được tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over
      const activeColumn = findcolumnbyCardId(activeDraggingCardId)
      const overColumn = findcolumnbyCardId(overCardId)
      // kiểm tra 1 trong 2 nếu không tồn tại thì không làm gì hết
      if (!activeColumn || !overColumn) return
      // hành động kéo thả card giữa 2 column khác nhau
      // phải dùng tới ActiveDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước
      // handleDragStart) chứ không phải dùng active trong scope HandleDragEnd này vì sau khi qua HandleDragOver
      // state của card đã được cập nhật lại
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        console.log('hành động kéo thả card khi 2 column khác nhau')
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // lấy vị trí cũ từ thằng oldColumnDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard.cards?.findIndex(c => c._id === activeDragItemId)
        // console.log('oldCardIndex:', oldCardIndex)
        // lấy vị trí mới từ over
        const newCardIndex = overColumn.cards.findIndex(c => c._id === over.id)
        // console.log('newCardIndex:', newCardIndex)
        // dùng arrayMore vì kéo card trong cùng 1 colunm thì logic tương tự như kéo colunm trong board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard.cards, oldCardIndex, newCardIndex)
        // console.log('dndOrderedCards', dndOrderedCards)
        const dndOrderCardIds = dndOrderedCards.map(card => card._id)
        // vẫn gọi update state ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả
        // cần phải chờ gọi Api (small trick)
        setOrderedColumns(prevColumns => {
          // Clone mãng gốc orderedClumns cũ ra một mãng mới để xử lý data rồi return và cập nhật lại orderedColumns
          const nextColumns = cloneDeep(prevColumns)
          // tìm tới cái column mà chúng ta đang thả
          // Biến tagetColumn sẽ là tham chiếu đến phần tử cụ thể trong nextColumns.
          const tagetColumn = nextColumns.find(column => column._id === overColumn._id)
          // console.log('nextColumns:', nextColumns)
          // console.log('tagetColumn:', tagetColumn)
          // cập nhật lại cards và cardOrderIds trong tagetColumn
          // biết const trong js có thể ghi đè được dữ liệu
          // tagetColumn là tham chiếu đến một phần tử trong nextColumns, bất kỳ thay đổi
          // nào bạn thực hiện trên tagetColumn đều sẽ thay đổi trực tiếp dữ liệu trong
          // nextColumns. Đây là cách JavaScript xử lý các đối tượng và mảng thông qua tham chiếu.
          tagetColumn.cards = dndOrderedCards
          tagetColumn.cardOrderIds = dndOrderCardIds
          return nextColumns
        })
        // gọi Api cập nhật lại dữ liệu cho cards
        moveCardInTheSameColumn(dndOrderedCards, dndOrderCardIds, oldColumnWhenDraggingCard._id)

      }

    }
    // xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        console.log('dragColumnActive:', active)
        console.log('dragColumnOver:', over)
        // lấy vị trí cũ từ active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới từ over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // dùng arrayMove() của dnd-kit để sắp xếp lại mãng columns ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // vẫn gọi update state ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả
        // cần phải chờ gọi Api (small trick)
        setOrderedColumns(dndOrderedColumns)
        // console.log('dndOrderedColumns', dndOrderedColumns)
        // gọi Api cập nhật lại dữ liệu cho columns
        moveColumns(dndOrderedColumns)
      }
      return
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  //animation khi thả Drop phần tử
  const dropAnimation = {
    duration: 300,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }
  // custom lại chiến lược thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns//
  // args = argments = các đối số, tham số
  const collisionDetectionStrategy = useCallback((args) => {
    // trường hợp kéo colunm dùng closestConers là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    // tìm ra các điểm giao nhau, va chạm ,trả về một mãng các va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)
    // console.log('pointerIntersections', pointerIntersections)
    if (!pointerIntersections?.length) return

    // first, let's see if there are any collisions with the pointer
    //Đầu tiên, hãy xem có bất kỳ va chạm nào với con trỏ không
    // !!pointerIntersections?.length bằng với pointerIntersections.length > 0
    // const intersections = !!pointerIntersections?.length ?
    // Collision Detection algorithms return an array of collisions
    // thuat toan phat hien va cham tra ve mot mang cac va cham
    // pointerIntersections :
    // if there are no collisions with the pointer , return rectangle intersections
    // nếu không có va chạm với con trỏ, trả về các giao điểm hình chữ nhật
    // rectIntersection(args)


    // tìm cái over đầu tiên trong mãng intersections
    let overId = getFirstCollision(pointerIntersections, 'id')
    // console.log('overId', overId)
    if (overId) {
      // nếu over nó là column thì nó sẽ tìm đến cái cardId gần nhất bên trong khu vực
      //va chạm, đó đựa vào thuật toán phát hiện va chạm closestCenter và closesCorners
      // đều được tuy nhiên ở đây thấy closestCorners mượt mà hơn
      const checkColunm = orderedColumns.find(colunm => colunm.id === overId)
      if (checkColunm) {
        console.log('overId before:', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColunm?.cardOrderIds?.includes(container.id))
          })
        }), [0]?.id
        // console.log('overId after:', overId)
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // nếu overId là null thì sẽ trả vè một mãng rỗng
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [ACTIVE_DRAG_ITEM_TYPE.COLUMN, activeDragItemType, orderedColumns])
  const backgroundImage = (theme) => theme.palette.mode === 'dark'
    ? 'url(/image/dark.jpg)'
    : 'url(/image/dddepth-353.jpg)'
  return (
    <DndContext sensors={sensors}
      // thuật toán phát hiện va chạm (nếu không có nó thì card và cover lớn sẽ không thể kéo qua colunm được vì
      // lúc này code đang bị conflict giữa card và colunm) chúng ta sẽ dùng closestCorners thay vì closestCenter
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu
      // collisionDetection={closestCorners}

      // custom nâng cao thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box sx={{
        // backgroundColor: 'primary.container',
        // backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#f50083' : '#45f500',
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        width: '100%',
        display: 'flex',
        height: (theme) => theme.trelloCumtom.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          columns={orderedColumns}
          deleteColumnDetails={deleteColumnDetails} />
        {/* code giữ chổ khi kéo column hoặc card */}
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType && null)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData}></Column>)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <TrelloCard card={activeDragItemData}></TrelloCard>)}
        </DragOverlay>
      </Box>
    </DndContext>

  )
}
