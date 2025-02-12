import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
export default function BoardBar({ board }) {
  const MENU_STYLES = {
    color: 'primary.main',
    bgcolor: 'primary.bg',
    border: 'none',
    borderRadius: '4px',
    '& .MuiSvgIcon-root': {
      color: 'primary.main'
    },
    '&:hover': {

      backgroundColor: '#35374B'

    }
  }
  return (
    <Box px={2} sx={{
      // bgcolor: 'primary.dark',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? ' #34495e' : 'primary.dark'),
      width: '100%',
      height: (theme) => theme.trelloCumtom.appBoardHeight,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #fff'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip sx={MENU_STYLES} icon={<SpaceDashboardIcon />} clickable label={board?.title} />
        </Tooltip>

        <Chip sx={MENU_STYLES} icon={<VpnLockIcon />} clickable label={capitalizeFirstLetter(board?.type)} />
        <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} clickable label="Add to google Diver" />
        <Chip sx={MENU_STYLES} icon={<ElectricBoltIcon />} clickable label="Automation" />
        <Chip sx={MENU_STYLES} icon={<FilterListIcon />} clickable label="Filters" />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button sx={{
          bgcolor: 'primary.pink',
          '&:hover': {
            transform: 'scale(0.9)',
            transition: 'transform 0.8s ease-in-out',
            bgcolor: 'primary.pink'
          }
        }} variant="outlined" startIcon={<PersonAddIcon />} href="#outlined-buttons">
          Invite
        </Button>
        <AvatarGroup max={6}
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
          <Tooltip title='minh phuc'>
            <Avatar alt="Remy Sharp" src="" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}
