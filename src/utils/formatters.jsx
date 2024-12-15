
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}// viết hoa chữ cái đầu


/* cách xử lý bug logic thư viện dnd-kit khi colunm rỗng
      * phía FE sẽ tự tạo ra 1 card đặc biệt placeholder card không liên quan tới back end
      *card đặc biệt này sẽ được ẩn ở phía Ui người dùng
      *cấu trúc Id của cái card này Unique rất đơn giản không cần phải làm random phức tạp:
      *colunmId-placeholder-card ( mỗi colunm chỉ có thể có 1 placeholder-card )
      *quan trọng khi tạo phải cần đầy đủ: _id, boardId, columnId, FE_placeholderCard)
      *** kỹ hơn nữa về cách tạo chuẩn ở bước nào thì sẽ ở phần tích hợp API Back End vào dự án
      (bởi vì đây là file mock-Data)
      */
export const generatePlaceholderCard = (colunm) => {
  return {
    _id: `${colunm._id}-placeholder-card`,
    boardId: colunm.boardId,
    columnId: colunm._id,
    FE_PlaceholderCard: true
  }
}

