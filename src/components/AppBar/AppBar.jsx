import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import WorksPaces from './menus/WorkPaces'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import Recent from './menus/Recent'
import Templates from './menus/Templates'
import Starred from './menus/Starred'
import Profiles from './menus/Profiles'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'

export default function AppBar() {
  const [search, setSearch] = useState()
  return (
    <Box px={2} sx={{
      backgroundColor: 'primary.bg',
      width: '100%', height: (theme) => theme.trelloCumtom.appBarHeight,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
      overflowX: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon fontSize='small' sx={{ color: 'primary.main' }} >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5
            2.5 0 0 0 19.5 2m-8.8 15.2a1.2 1.2 0 0 1-1.2 1.2H5.8c-.66 0-1.2-.54-1.2-1.2V5.8a1.2 1.2 0 0
             1 1.2-1.2h3.7c.66 0 1.2.54 1.2 1.2zm8.7-5c0 .66-.54 1.2-1.2 1.2h-3.7c-.66 0-1.2-.54-1.2-1.2V5.8c0-.66.54-1.2
              1.2-1.2h3.7c.66 0 1.2.54 1.2 1.2z" />
            </svg>
          </SvgIcon>
          <Typography sx={{ fontSize: '1.2ren', fontWeight: 'bold', color: 'primary.main' }} variant='span'>
            Trello
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <WorksPaces />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined" startIcon={<AddIcon />} href="#outlined-buttons">
            Create
          </Button>
        </Box>

      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField sx={{ minWidth: '120px', maxWidth: '180px' }}
          id="outlined-search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: 'white' }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon sx={{ display: search ? 'inline-block' : 'none', color: 'white', cursor: 'pointer' }}
                  onClick={() => setSearch('')}
                  fontSize='small' />
              </InputAdornment>
            )
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search..."
          type="input"
          size='small' />

        <ModeSelect sx={{ minWidth: '120px' }} />
        <Tooltip title='Notification' arrow>
          <Badge color="secondary" variant="dot">
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title='Help' arrow>
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>

        <Profiles sx={{ cursor: 'pointer' }} />

      </Box>
    </Box>
  )
}
