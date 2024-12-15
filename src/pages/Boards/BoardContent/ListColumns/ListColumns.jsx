import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import './style.css'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'
import { toast } from 'react-toastify'
export default function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [NewColumnTitle, setNewColumnTitle] = useState('')
  const togleopenNewColumnForm = () => (setOpenNewColumnForm(!openNewColumnForm))
  const addNewColumn = () => {
    if (!NewColumnTitle) {
      toast.error('please enter column title')
      return
    }
    createNewColumn(NewColumnTitle)
    setOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        bgcolor: 'inherit',
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}>

        {columns?.map(column => (
          <Column
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
          />
        ))}

        {!openNewColumnForm ?
          <Box onClick={togleopenNewColumnForm} className="pulsate-bck" sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '5px',
            height: 'fit-content'
          }}>
            <Button sx={{
              bgcolor: '#6fa5fc',
              width: '100%',
              '&:hover': {
                bgcolor: '#211C6A'
              }
            }} startIcon={<AddCircleOutlineIcon />}> Add new column</Button>
          </Box>
          :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField value={NewColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              label="Enter column title..."
              type="input"
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
                onClick={addNewColumn}
                sx={{
                  boxShadow: 'none',
                  bgcolor: '#96b9ff',
                  color: 'white',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.warning,
                  '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.secondary.bntcolor : theme.palette.secondary.light }
                }}>
                Add column
              </Button>
              <CloseIcon onClick={togleopenNewColumnForm} sx={{ color: 'white', cursor: 'pointer' }}

                fontSize='small' />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>

  )
}
