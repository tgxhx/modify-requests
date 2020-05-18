import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { AppBar, AppBarProps, Drawer, DrawerProps } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

const drawerWidth = 300;

export const Article = styled.article<{ open: boolean; theme: Theme }>(
  ({ open, theme }) => css`
    margin-left: ${open && `${drawerWidth}px`};
    transition: ${open
      ? theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        })
      : theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        })};

    @media (max-width: 1200px) {
      margin-left: ${open && `${drawerWidth - 60}px`};
    }
  `
);

export const StyledAppBar = styled(AppBar)<
  AppBarProps & {
    open: boolean;
  }
>(
  ({ open }) => css`
    z-index: 1201;
  `
);

export const StyledDrawer = styled(Drawer)<DrawerProps>`
  width: ${drawerWidth}px;
  flex-shrink: 0;
  .drawer-paper {
    width: ${drawerWidth}px;
    border-right: none;
    background-color: #fafafa;
  }

  @media (max-width: 1200px) {
    width: ${drawerWidth - 60}px;
    .drawer-paper {
      width: ${drawerWidth - 60}px;
    }
  }
`;

export const StyledLink = styled(Link)`
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
`;
