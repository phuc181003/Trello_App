
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
export default function TrelloCard({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,

    transition: {
      duration: 300, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    },

    data: { ...card }
  })
  const dndKitCardStyles = {
    // touchAction:'none',
    // nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    border: isDragging ? '1px solid #EF5A6F' : undefined
  }
  const shouldShowCarrdActions = () => {
    return (!!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length)
  }
  return (

    <Card
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0, 0, 0.4, 0.2)',
        visibility: card?.FE_PlaceholderCard ? 'hidden' : 'visible',
        minWidth: card.FE_PlaceholderCard ? '280px' : 'unset',
        height: card?.FE_PlaceholderCard ? 'unset' : 'unset',
        position: card.FE_PlaceholderCard ? 'unset' : 'unset',
        overflow: card.FE_PlaceholderCard ? 'hidden' : 'unset',
        transition: '0.5s ease',
        '&:hover': {
          boxShadow: '3px 4px 8px rgba(0, 0, 0.4, 0.2)'
        }
      }}>
      {card?.cover &&
        <CardMedia
          sx={{ height: 140 }}
          image={card.cover}
        />
      }

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card.title} </Typography>
      </CardContent>
      {shouldShowCarrdActions() &&
        <CardActions sx={{ p: '0 4px 8px 12px' }}>
          {!!card?.memberIds.length &&
            <Button sx={{ bgcolor: 'primary.light' }} size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
          }
          {!!card?.comments.length &&
            <Button sx={{ bgcolor: 'primary.specialColor' }} size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
          }
          {!!card?.attachments.length &&
            <Button sx={{ bgcolor: 'primary.bntcolor' }} size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
          }
        </CardActions>
      }

    </Card>
  )


}
