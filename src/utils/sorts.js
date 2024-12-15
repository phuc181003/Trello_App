//  For Vietnamese with love :D
//  Xác định các phần tử trong array gốc ban đầu (originalArray)
// xem nó nằm ở đâu trong array thứ 2 (orderArray) (là array mà mình dùng để sắp xếp)
//bằng cách tìm index (indexOf) rồi sẽ sắp xếp theo index đó bằng hàm sort của Javascript.

export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return []
  // kiểm tra giá trị của từng tham số nếu 1 trong 3 tham số không hợp lệ, trả về một mảng rỗng.
  const clonedArray = [...originalArray]
  // copy 1 mãng mới
  const orderedArray = clonedArray.sort((a, b) => {
    // dùng Arr.sort() để so sánh và sắp xếp lại mãng mới theo orderArray
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
    //dùng .indexOf() tìm ra giá trị index của a[key] và b[key] trong orderArray
    // ví dụ: a là phần tử thứ nhất trong mãng originalItems [
    //  { id: 'id-1', name: 'One' }, = a
    //  { id: 'id-2', name: 'Two' }, = b
    //]
    // vậy a[key] = dựa theo key truyền vào là : key = "id"
    // ta có a = orderArray.indexOf(id-1) hàm này trả về giá trị index của id-1 trong mãng orderArray[]
    // b cũng tương tự
    // tiếp theo là (a - b)
  })
  return orderedArray
  // sắp xếp trả về mãng mới
}
/**
* Example:
*/
// const originalItems = [
//   { id: 'id-1', name: 'One' },
//   { id: 'id-2', name: 'Two' },
//   { id: 'id-3', name: 'Three' },
//   { id: 'id-4', name: 'Four' },
//   { id: 'id-5', name: 'Five' }
// ]
//                       // 0     //1     //2     //3      //4
// const itemOrderIds = ['id-3', 'id-4', 'id-2', 'id-1', 'id-5']
/*
 1  1,2 =1
 2  1,3 =3
 3  1,4 =2
 4  1,5 = -1
 5  2,3 =2
 6  2,4 =1
 7  2,5 = -2
 8  3,4 = -1
 9  3,5 = -4
 10 4,5 = -3
 */
// const key = 'id'

// const orderedArray = mapOrder(originalItems, itemOrderIds, key)
// console.log('Original:', originalItems)
// console.log('Ordered:', orderedArray)