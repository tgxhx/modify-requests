import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'jsoneditor/dist/jsoneditor.min.css';
import {
  Container,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Menu as MenuIcon, Create as CreateIcon } from '@material-ui/icons';
import { Article, StyledAppBar, StyledDrawer, StyledLink } from './home-style';
import ModifyResponse from './modify-response';

export default function Home() {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();

  const handleToggleDrawerOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleToggleDrawerOpen}
            edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Modify Request and Response
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
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary={<StyledLink to="/response">修改返回值</StyledLink>} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary={<StyledLink to="/request">修改请求值</StyledLink>} />
          </ListItem>
        </List>
      </StyledDrawer>
      <Article open={open} theme={theme}>
        <Toolbar />
        <Container>
          <Switch>
            <Route path="/" exact={true}>
              <Redirect to="/response" />
            </Route>
            <Route path="/response">
              <ModifyResponse />
            </Route>
            <Route path="/request">
              <ModifyResponse />
            </Route>
          </Switch>
        </Container>
      </Article>
    </div>
  );
}
