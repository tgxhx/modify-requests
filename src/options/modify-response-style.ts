import styled, { css } from 'styled-components';
import { Typography, ExpansionPanelSummary } from '@material-ui/core';

export const StyledList = styled.section`
  margin: 0 auto;
  padding: 50px 0;
  min-width: 960px;
  max-width: 1200px;
`;

export const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)`
  width: 100%;
  &.Mui-expanded {
    border-bottom: 2px solid rgba(0, 0, 0, 0.42);
  }
`;

export const StyledTypography = styled(Typography)<{ second?: number; remove?: number }>(
  ({ second, remove }) => css`
    font-size: ${second ? 12 : 16}px;
    flex: ${second ? 2 : remove ? 0 : 1};
    margin-right: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${remove &&
    `
      width: 24px;
      height: 24px;
      margin-right: 0;
      overflow: visible;
    `};
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
