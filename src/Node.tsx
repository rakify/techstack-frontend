import styled from "styled-components";
const FolderList = styled.div`
  background-color: #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 5px;
  padding: 5px;
  transition: background-color 2s ease-out;
  :hover {
    background-color: white;
  }
`;
const FolderLeft = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: {props.level * 16}px;
  border-left: 1px solid black;
  padding-left: 5px;
  gap: 5px;
`;
const Name = styled.div`
  margin-left: 5px;
`;
const Button = styled.button`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: #a6a6a6;
    color: white;
  }
`;

const Button2 = styled.button`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 100%;
  :hover {
    background-color: red;
    color: white;
  }
`;

interface childProps {
  item: {
    id: string;
    name: string;
    parentId: string;
  };
  level: number;
  onToggle: any;
  addFolder: any;
  deleteFolder: any;
  selected: boolean;
}

const Node = (props: childProps) => {
  return (
    <>
      <FolderList>
        <FolderLeft>
          <Button onClick={props.onToggle}>{props.selected ? "↓" : "→"}</Button>
          <Name>{props.item.name}</Name>
          <Button2 onClick={props.deleteFolder}>X</Button2>
        </FolderLeft>
        <button style={{ cursor: "pointer" }} onClick={props.addFolder}>
          + New
        </button>
      </FolderList>
    </>
  );
};

export default Node;
