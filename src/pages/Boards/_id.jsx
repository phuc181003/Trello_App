/* eslint-disable no-undef */
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { createNewCardApi, createNewColumnApi, deleteColumnDetailsAPI, fetchBoardDetailAPI, moveCardToDifferentColumnAPI, updateBoardDetailAPI, updateColumnAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import Loader from './loader'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '66f4154dd00b7ee4586cea16'
    fetchBoardDetailAPI(boardId).then(board => {
      console.log('🚀 ~ fetchBoardDetailAPI ~ board:', board)

      // sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bênh dưới các component con
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
      // xử lý vấn đề kéo thả card vào một column rỗng là tạo ra một card giả ở FE
      board?.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)],
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sắp xếp thứ tự các card luôn ở đây trước khi đưa dữ liệu xuống bênh dưới các component con
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])
  const createNewColumn = async (column) => {
    const data = {
      title: column,
      boardId: board._id
    }
    const newColumn = await createNewColumnApi(data)
    // khi tạo một column mới thì chưa có card , cần thêm card giả để xử lý vấn đề column rỗng
    newColumn.cards = [generatePlaceholderCard(column)],
      newColumn.cardOrderIds = [generatePlaceholderCard(column)._id]
    // cập nhật lại state cho board
    const newBoard = { ...board }
    newBoard.columns.push(newColumn)
    newBoard.columnOrderIds.push(newColumn._id)
    setBoard(newBoard)
  }
  // khi di chuyển column trong cùng một board
  // ta chỉ cần gọi Api để cập nhật lại mãng columnOrderIds của board chứa nó (thay đổi vị trí trong board)
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    // console.log('dndOrderedColumns:', dndOrderedColumns)
    // console.log('dndOrderedColumnsIds:', dndOrderedColumnsIds)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    updateBoardDetailAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }
  // xử lý xóa một column và cards[] bên trong column đó
  const deleteColumnDetails = async (columnId) => {
    // set board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }
  const createNewCard = async (card) => {
    const newCard = await createNewCardApi({ ...card, boardId: board._id })
    // cập nhật lại state cho board
    const newBoard = { ...board }
    const findColumn = newBoard.columns.find(c => c._id === newCard.columnId)
    console.log('🚀 ~ createNewCard ~ findColumn:', findColumn)

    if (findColumn) {
      // nếu column rỗng bản chất là đang chưa một placeholder-card
      if (findColumn.cards.some(card => card.FE_PlaceholderCard)) {
        // kiểm tra arr cards có card placeholder không dụ vào thuộc
        // tính FE_PlaceholderCard nếu có thì gián lại giá trị của cards và cardOrderIds bằng card mới tạo
        findColumn.cards = [newCard]
        findColumn.cardOrderIds = [newCard._id]
      } else {
        // ngược lại nếu không có placeholder-card thì push phần tử card vừa tạo vào cuối mãng cards và cardOrderIds
        findColumn.cards.push(newCard)
        findColumn.cardOrderIds.push(newCard._id)
      }

    }
    setBoard(newBoard)
  }
  // khi di chuyển card trong cùng một column
  // ta chỉ cần gọi Api để cập nhật lại mãng cardOrderIds của column chứa nó (thay đổi vị trí trong column)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderCardIds, columnId) => {
    // console.log('dndOrderedCards:', dndOrderedCards)
    // console.log('dndOrderCardIds:', dndOrderCardIds)
    // console.log('columnId:', columnId)
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards, columnToUpdate.cardOrderIds = dndOrderCardIds
    }
    setBoard(newBoard)
    updateColumnAPI(columnId, { cardOrderIds: dndOrderCardIds })
  }
  // khi di chuyển card sang column khác:
  // B1 : cập nhật lại mãng cardOrderIds của column ban đầu chứa nó (xóa cái _id của card ra khỏi mãng)
  // B2 : cập nhật lại mãng cardOrderIds của column tiếp theo (thêm cái _id của card vào mãng)
  // B3 : cập nhật lại trường columnId mới cho card đã kéo đó
  const moveCardToDifferenColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // console.log('currentCardId', currentCardId)
    // console.log('prevColumnId:', prevColumnId)
    // console.log('nextColumnId:', nextColumnId)
    // console.log('dndOrderedColumns:', dndOrderedColumns)

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    // gọi Api
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // xử lý vấn đề khi kéo phần tử card cuối cùng ra khỏi column, column rỗng sẽ có placeholder- card
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })

  }
  if (!board) {
    return (
      <Loader>deploy free chờ chút nhé...</Loader>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferenColumn={moveCardToDifferenColumn}
        deleteColumnDetails={deleteColumnDetails} />
    </Container>
  )
}

export default Board