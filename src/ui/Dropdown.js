import React from 'react'

function DropdownMenu({id}) {
  return (
    <>
      <IconButton
        aria-owns={open ? 'menu-bottle' : undefined}
        aria-haspopup="true"
        onClick={onOpen}
        color="inherit"
        title={t('label.open_menu')}
        aria-label={t('label.open_menu')}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id="menu-bottle"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={onClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          {t('label.edit')}
        </MenuItem>
        <Divider />
        {items.map(item => {
          const Icon = ICONS[item.status]
          return (
            <MenuItem key={item.status} onClick={handleCreateLog(item.status)}>
              {Icon ? (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              ) : null}
              <Trans
                i18nKey={`enum.status.${item.status}`}
                count={item.count}
              />
              {showCount ? ` (${item.count})` : null}
            </MenuItem>
          )
        })}
        {items.length ? <Divider /> : null}
        {bottles.length === 1 ? (
          <MenuItem onClick={onClose}>
            <ListItemIcon>
              <DuplicateIcon />
            </ListItemIcon>
            {t('label.duplicate')}
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleAskDelete} className={classes.delete}>
          <ListItemIcon>
            <DeleteIcon className={classes.delete} />
          </ListItemIcon>
          {t('label.delete')}
        </MenuItem>
      </Menu>
    </>
  )
}

export default DropdownMenu
