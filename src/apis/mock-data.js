export const mockData = {
  board: {
    _id: 'board-id-01',
    title: 'Minh Phuc 06537',
    description: 'MERN stack Course',
    type: 'public', // 'private'
    ownerIds: [], // Những users là Admin của board
    memberIds: [], // Những users là member bình thường của board
    columnOrderIds: ['column-id-01', 'column-id-02', 'column-id-03', 'column-id-04'], // Thứ tự sắp xếp / vị trí của các Columns trong 1 boards
    columns: [
      {
        _id: 'column-id-01',
        boardId: 'board-id-01',
        title: 'To Do Column 01',
        cardOrderIds: ['card-id-02', 'card-id-01', 'card-id-03', 'card-id-04', 'card-id-05', 'card-id-06', 'card-id-07'],
        cards: [
          {
            _id: 'card-id-01',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 01',
            description: 'Markdown Syntax (sẽ ở khóa nâng cao nhé)',
            cover: 'https://images.unsplash.com/photo-1724220781877-14e4bab5ae09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8',
            memberIds: ['test-user-id-01'],
            comments: ['test comment 01', 'test comment 02'],
            attachments: ['test attachment 01', 'test attachment 02', 'test attachment 03']
          },
          { _id: 'card-id-02', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 02', description: null, cover: null, memberIds: ['test-user-id-01'], comments: [], attachments: [] },
          { _id: 'card-id-03', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 03', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-04', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 04', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-05', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 05', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-06', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 06', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-07', boardId: 'board-id-01', columnId: 'column-id-01', title: 'Title of card 07', description: null, cover: null, memberIds: [], comments: [], attachments: [] }
        ]
      },
      {
        _id: 'column-id-02',
        boardId: 'board-id-01',
        title: 'Inprogress Column 02',
        cardOrderIds: ['card-id-08', 'card-id-09', 'card-id-10'],
        cards: [
          { _id: 'card-id-08', boardId: 'board-id-01', columnId: 'column-id-02', title: 'Title of card 08', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-09', boardId: 'board-id-01', columnId: 'column-id-02', title: 'Title of card 09', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-10', boardId: 'board-id-01', columnId: 'column-id-02', title: 'Title of card 10', description: null, cover: null, memberIds: [], comments: [], attachments: [] }
        ]
      },
      {
        _id: 'column-id-03',
        boardId: 'board-id-01',
        title: 'Done Column 03',
        cardOrderIds: ['card-id-11', 'card-id-12', 'card-id-13'],
        cards: [
          { _id: 'card-id-11', boardId: 'board-id-01', columnId: 'column-id-03', title: 'Title of card 11', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-12', boardId: 'board-id-01', columnId: 'column-id-03', title: 'Title of card 12', description: null, cover: null, memberIds: [], comments: [], attachments: [] },
          { _id: 'card-id-13', boardId: 'board-id-01', columnId: 'column-id-03', title: 'Title of card 13', description: null, cover: null, memberIds: [], comments: [], attachments: [] }
        ]
      },
      {
        _id: 'column-id-04',
        boardId: 'board-id-01',
        title: 'empty Column 04',
        /* cách xử lý bug logic thư viện dnd-kit khi colunm rỗng
        * phía FE sẽ tự tạo ra 1 card đặc biệt placeholder card không liên quan tới back end
        *card đặc biệt này sẽ được ẩn ở phía Ui người dùng
        *cấu trúc Id của cái card này Unique rất đơn giản không cần phải làm random phức tạp:
        *colunmId-placeholder-card ( mỗi colunm chỉ có thể có 1 placeholder-card )
        *quan trọng khi tạo phải cần đầy đủ: _id, boardId, columnId, FE_placeholderCard)
        *** kỹ hơn nữa về cách tạo chuẩn ở bước nào thì sẽ ở phần tích hợp API Back End vào dự án
        (bởi vì đây là file mock-Data)
        */
        cardOrderIds: ['colunm-id-04-placeholder-card'],
        cards: [
          {
            _id: 'colunm-id-04-placeholder-card',
            boardId: 'board-id-01',
            columnId: 'column-id-04',
            FE_PlaceholderCard: true
          }
        ]
      }
    ]
  }
}