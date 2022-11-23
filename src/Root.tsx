import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Branch from "./Branch";

axios.defaults.baseURL = "https://techstack-api.onrender.com/api";

const Container = styled.div``;
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #696969;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: bold;
`;
const FolderList = styled.div`
  background-color: #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-left: 1px solid black;
  padding-left: 5px;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 5px;
  transition: background-color 2s ease-out;
  padding: 5px;
  :hover {
    background-color: white;
  }
`;
const Name = styled.div`
  margin-left: 5px;
`;
const FolderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

type folderType = {
  id: string;
  name: string;
  parentId: string;
};

function Root() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [rootSelected, setRootSelected] = useState(false);
  const [childs, setChilds] = useState<folderType[]>([]);
  const [nameToAdd, setNameToAdd] = useState("");
  const [addMsg, setAddMsg] = useState("");

  const parentName = "Root";
  const parentId = "6378ef7cb6ccf501ad5153d7";

  // add new folder
  const addFolderHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    nameToAdd !== "" &&
      // Add folder
      axios
        .post(`/folders`, {
          name: nameToAdd,
          parentName,
          parentId,
        })
        .then((res) =>
          // Update its parent
          axios
            .put(`/folders/${parentId}`, {
              name: res.data.data.name,
              id: res.data.data._id,
            })
            .then((res) => {
              if (res.status === 200) {
                setChilds(res.data.childs);
                setAddMsg("New folder added successfully.");
              }
            })
        )
        .catch((err) => {
          setAddMsg(err);
        });
  };

  //get childs of Root
  useEffect(() => {
    axios
      .get(`/folders/find/${parentId}`)
      .then((res) => {
        // handle success
        setChilds(res.data);
      })
      .catch((err) => {
        // handle error
        console.log(err);
      });
  }, [parentId]);

  return (
    <Container>
      <Title>Folder Structure</Title>
      {/* open dialog when user wants to add new folder */}
      <dialog
        style={{
          maxWidth: "50ch",
          margin: "auto",
          width: "300px",
          height: "250px",
        }}
        open={openAddModal}
      >
        {addMsg === "" ? (
          <>
            <p>Add Folder in `{parentName}`</p>
            <form onSubmit={addFolderHandler} style={{ margin: "10px" }}>
              <input
                type="text"
                name="name"
                placeholder="Folder Name"
                style={{ width: "100%" }}
                onChange={(e) => setNameToAdd(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => {
                    setOpenAddModal(false);
                  }}
                >
                  Cancel
                </button>
                <input type="submit" value="Create" />
              </div>
            </form>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p>{addMsg}</p>
            <button
              style={{ color: "white", backgroundColor: "red" }}
              onClick={() => {
                setOpenAddModal(false);
                setAddMsg("");
              }}
            >
              ✗
            </button>
          </div>
        )}
      </dialog>

      <FolderList>
        <FolderLeft>
          <Button
            onClick={() => {
              setRootSelected(!rootSelected);
            }}
          >
            {rootSelected ? "↓" : "→"}
          </Button>
          <Name>Root</Name>
        </FolderLeft>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            setOpenAddModal(true);
          }}
        >
          + New
        </button>
      </FolderList>
      {rootSelected && !childs.length && (
        <div
          style={{
            marginLeft: `50px`,
            color: "red",
          }}
        >
          - No folder.
        </div>
      )}
      {rootSelected &&
        childs.length > 0 &&
        childs.map((item) => <Branch key={item.id} item={item} level={1} />)}
    </Container>
  );
}

export default Root;
