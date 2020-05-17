import * as React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import 'jsoneditor/dist/jsoneditor.min.css';
import {
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@material-ui/core';
import { Menu as MenuIcon, Inbox as InboxIcon } from '@material-ui/icons';
import { Article, StyledAppBar, StyledDrawer } from './home-style';
import ModifyResponse from './modify-response';

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleToggleDrawerOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <StyledAppBar open={open} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleToggleDrawerOpen}
            edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Modify Requests
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: 'drawer-paper',
        }}>
        <Toolbar />
        <List>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={<Link to="/">Link</Link>} />
          </ListItem>
        </List>
        <Divider />
      </StyledDrawer>
      <Article open={open} theme={theme}>
        <Toolbar />
        <Container>
          <Switch>
            <Route path="/" exact={true}>
              <ModifyResponse />
            </Route>
            <Route>
              <ModifyResponse />
            </Route>
          </Switch>
        </Container>
      </Article>
    </div>
  );
}
