import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Branch from "./Branch";

// base backend url throughout app
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
  // since render closes its web service in every 15 minutes inactivity I should check if thats live yet
  const [connection, setConnection] = useState(false);

  // Root
  const parentName = "Root";
  const parentId = "6378ef7cb6ccf501ad5153d7";

  // function to add new folder
  const addFolderHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add folder
    nameToAdd !== "" &&
      axios
        .post(`/folders`, {
          name: nameToAdd,
          parentName,
          parentId,
        })
        .then((res) =>
          // Update its parent (add to parents child)
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

  // Get childs of Root onload
  useEffect(() => {
    axios
      .get(`/folders/find/${parentId}`)
      .then((res) => {
        res.status === 200 && setConnection(true);
        setChilds(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [parentId]);

  return (
    <Container>
      <Title>Folder Structure</Title>
      {/* // since render closes its web service in every 15 minutes inactivity I should check if thats live yet */}
      {!connection && (
        <p style={{ color: "red" }}>
          I am using render free web service which stops in every 15mins of
          inactivity. Api is not ready yet.. So please wait a while..
        </p>
      )}
      {/* open dialog when user wants to add new folder to Root */}
      <dialog
        style={{
          maxWidth: "50ch",
          margin: "auto",
          width: "300px",
          height: "250px",
        }}
        open={openAddModal}
      >
        {/* show form to input folder name to add or if submits display result */}
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
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenAddModal(false);
                  }}
                >
                  Cancel
                </button>
                <input
                  style={{ cursor: "pointer" }}
                  type="submit"
                  value="Create"
                />
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
              style={{
                color: "white",
                backgroundColor: "red",
                cursor: "pointer",
              }}
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
