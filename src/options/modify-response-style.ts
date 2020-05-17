import styled, { css } from 'styled-components';
import { Typography, ExpansionPanelSummary } from '@material-ui/core';

export const StyledList = styled.section`
  padding: 50px 0;
`;

export const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)`
  &.Mui-expanded {
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  }
`;

export const StyledTypography = styled(Typography)<{ second?: number; remove?: number }>(
  ({ second, remove }) => css`
    ${remove &&
    `
      width: 24px;
      height: 24px;
    `};
    font-size: ${second ? 12 : 16}px;
    flex: ${second ? 2 : remove ? 0 : 1};
  `
);

export const StyledPanelDetail = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  > * {
    margin-bottom: 20px;
  }
`;
