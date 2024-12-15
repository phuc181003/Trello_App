import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import AddCardIcon from '@mui/icons-material/AddCard'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ListItemIcon from '@mui/material/ListItemIcon'
import Cloud from '@mui/icons-material/Cloud'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
export default function Colunm({ column, createNewCard, deleteColumnDetails }) {
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [NewCardTitle, setNewCardTitle] = useState('')
  const togleopenNewCardForm = () => (setOpenNewCardForm(!openNewCardForm))
  const confirmDeleteColumn = useConfirm()
  const addNewCard = () => {
    if (!NewCardTitle) {
      toast.error('please enter card title')
      return
    }
    createNewCard({ title: NewCardTitle, columnId: column._id })
    setOpenNewCardForm()
    setNewCardTitle('')
  }
  // xóa một column và nhiều cards bên trong column đó
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: `Delete Column: ${column.title} `,
      description: 'this action will permanently delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      confirmationButtonProps: { variant: 'outlined' },
      allowClose: false,
      dialogProps: { maxWidth: 'xs' },
      confirmationKeyword: `${column.title}`,
      confirmationKeywordTextFieldProps: {
        autoFocus: true,
        placeholder: 'gõ lại tên column muốn xóa',
        variant: 'standard'
      }
    }).then(() => {
      // gọi lên props đến conponent cha cao nhất để xử lý gọi API
      deleteColumnDetails(column._id)

    }).catch(() => {
      /* ... */
    })
  }
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column },
    height: '100%',
    transition: {
      duration: 300, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const dndKitColumnStyles = {
    // touchAction:'none',
    // nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform), transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: 'pointer',
    height: '100%'
  }
  // sắp xếp lại mãng
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // dropdow
  // const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  const orderedCards = column?.cards
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          ml: 2,
          bgcolor: 'primary.Boxcolumn',
          border: 1,
          borderColor: 'primary.dark',
          borderRadius: '5px',
          boxShadow: 3,
          height: 'fit-content'
        }}>
        {/* Box column header */}
        <Box sx={{
          height: (theme) => (theme.trelloCumtom.columnHeaderHeight),
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'

        }}>
          <Typography variant='h6' sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>
          <Box sx={{}}>
            <Tooltip title='More option'>
              <ExpandMoreIcon
                sx={{ color: '', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick} />
            </Tooltip>

            <Menu
              id="basic-menu-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={togleopenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' }
                  }
                }} >
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Card</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon><Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }} onClick={handleDeleteColumn}>
                <ListItemIcon><DeleteForeverIcon className='delete-forever-icon' fontSize="medium" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* Box column list card */}
        <ListCards cards={orderedCards} />
        {/* Box column footer */}
        {!openNewCardForm ?

          <Box sx={{
            // height: (theme) => (theme.trelloCumtom.columnFooterHeight),
            height: 'fit-content',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Button onClick={togleopenNewCardForm} sx={{
              bgcolor: 'primary.bg',
              '&:hover': {
                bgcolor: 'primary.bntcolor',
                cursor: 'pointer'
              }
            }} startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to more ">
              <DragHandleIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>


          :

          <Box sx={{
            minWidth: '280px',
            maxWidth: '280px',
            p: 1,
            m: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative'
          }}>
            <CloseIcon fontSize='small'
              onClick={togleopenNewCardForm}
              sx={{
                color: 'black',
                cursor: 'pointer',
                position: 'absolute',
                top: '-8px',
                right: '-8px'
              }}
            />
            <TextField value={NewCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              label="Enter card title..."
              type="input"
              data-no-dnd="true"
              autoFocus
              variant='outlined'
              size='small'
              sx={{
                '& label': { color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' },
                '& input': { color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' },
                '& label.Mui-focused': { color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'primary.bg' },
                  '&:hover fieldset': { borderColor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'primary.bg' },
                  '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'primary.bg' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant='contained' size='small' color='success'
                onClick={addNewCard}
                sx={{
                  boxShadow: 'none',
                  bgcolor: '#96b9ff',
                  color: 'white',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.warning,
                  '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.secondary.bntcolor : theme.palette.container }
                }}>
                Add new card
              </Button>
            </Box>
          </Box>


        }

      </Box>
    </div>

  )
}
