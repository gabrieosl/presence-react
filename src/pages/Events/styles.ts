import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  background: #dedede;

  justify-content: flex-start;

  div.events-holder {
    max-width: 1000px;
    margin: 50px auto;

    display: flex;
    flex-direction: column;
  }

  div.event {
    display: flex;
  }
`;
