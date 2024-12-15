import axiosInstance from './axiosInstance'
// boards
export const fetchBoardDetailAPI = async (boardId) => {
  const response = await axiosInstance.get(`/boards/${boardId}`)
  return response.data
}
export const updateBoardDetailAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(`/boards/${boardId}`, updateData)
  return response.data
}
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axiosInstance.put('/boards/supports/moving_card', updateData)
  return response.data
}

//columns
export const createNewColumnApi = async (column) => {
  const response = await axiosInstance.post('/columns', column)
  return response.data
}
export const updateColumnAPI = async (columnId, updateData) => {
  const response = await axiosInstance.put(`/columns/${columnId}`, updateData)
  return response.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axiosInstance.delete(`/columns/${columnId}`)
  return response.data
}
//cards
export const createNewCardApi = async (card) => {
  const response = await axiosInstance.post('/cards', card)
  return response.data
}