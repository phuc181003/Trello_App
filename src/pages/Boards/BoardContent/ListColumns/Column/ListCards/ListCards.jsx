import Box from '@mui/material/Box'
import TrelloCard from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
export default function ListCards({ cards }) {

  return (
    <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: '0.5s ease,',
        maxHeight: (theme) => `calc( ${theme.trelloCumtom.boardContentHeight} -
    ${theme.spacing(5)} -
    ${theme.trelloCumtom.columnHeaderHeight} -
    ${theme.trelloCumtom.columnFooterHeight}
    )`,
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#b7b7a4',
          borderRadius: '8px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#948979',
          borderRadius: '8px'
        }
      }}>
        {cards?.map(card => <TrelloCard key={card._id} card={card} />)}
      </Box>
    </SortableContext>

  )
}
