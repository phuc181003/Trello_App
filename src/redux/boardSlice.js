import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  value: 0
}
const boardSlice = createSlice({
  name: 'board',
  initialState: {
    boards: {
      allBoard: null,
      isFetching: false,
      error: false
    },
    columns: [],
    columnOrderIds: []
  },
  reducers: {
    setBoard(state, action) {
      state.columns = action.payload.columns
      state.columnOrderIds = action.payload.columnOrderIds
    },
    updateColumnOrder(state, action) {
      state.columnOrderIds = action.payload
    },
    moveCard(state, action) {
      const { fromColumnId, toColumnId, cardId, newIndex } = action.payload
      // Implement logic to move the card from one column to another
    }
    // Add more reducers as needed
  },
})

export const { setBoard, updateColumnOrder, moveCard } = boardSlice.actions
export default boardSlice.reducer