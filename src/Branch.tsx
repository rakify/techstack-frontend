import axios from "axios";
import React, { useState, useEffect } from "react";
import Node from "./Node";

interface childProps {
  item: {
    id: string;
    name: string;
    parentId: string;
  };
  level: number;
}

type folderType = {
  id: string;
  name: string;
  parentId: string;
};

const Branch = (props: childProps) => {
  const [selected, setSelected] = useState(false);
  const [childs, setChilds] = useState<folderType[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentId, setParentId] = useState("");
  const [nameToAdd, setNameToAdd] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  // add new folder
  const addFolderHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    parentName !== "" &&
      parentId !== "" &&
      nameToAdd !== "" &&
      axios
        .post(`/folders`, {
          name: nameToAdd,
          parentName,
          parentId,
        })
        .then((res) =>
          axios
            .put(`/folders/${parentId}`, {
              name: res.data.data.name,
              id: res.data.data._id,
            })
            .then((res) => {
              setChilds(res.data.childs);
              res.status === 200 && setAddMsg("New folder added successfully.");
            })
        )
        .catch((err) => {
          setAddMsg(err);
        });
  };

  // delete folder
  const deleteFolderHandler = async () => {
    axios
      .delete(`/folders/delete`, {
        data: {
          id: props.item.id,
          parentId: props.item.parentId,
        },
      })
      .then((res) => {
        res.status === 200 && setDeleteMsg("Folder deleted successfully.");
      })
      .catch((err) => {
        setDeleteMsg(err);
      });
  };
  //get childs of this id only when id changes
  useEffect(() => {
    axios
      .get(`/folders/find/${props.item.id}`)
      .then((res) => {
        // handle success
        setChilds(res.data);
      })
      .catch((err) => {
        // handle error
        console.log(err);
      });
  }, [props.item.id]);

  //checking if there exists children
  const hasChildren = childs && childs.length !== 0;

  const renderBranches = () => {
    if (hasChildren) {
      const newLevel = props.level + 1;

      return childs.map((child) => {
        return <Branch key={child.id} item={child} level={newLevel} />;
      });
    }
    return (
      <div
        style={{
          marginLeft: `${(5 + props.level) * 16}px`,
          color: "green",
        }}
      >
        - No folder.
      </div>
    );
  };

  const toggleSelected = () => {
    setSelected((prev) => !prev);
  };

  const addFolder = () => {
    setOpenAddModal(true);
    setParentName(props.item.name);
    setParentId(props.item.id);
  };
  const deleteFolder = () => {
    setOpenDeleteModal(true);
  };

  return (
    <>
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
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => {
                    setOpenAddModal(false);
                    setParentId("");
                    setParentName("");
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
                setParentId("");
                setParentName("");
                setAddMsg("");
              }}
            >
              ✗
            </button>
          </div>
        )}
      </dialog>

      {/* Dialog to Delete */}
      <dialog
        style={{
          maxWidth: "50ch",
          margin: "auto",
          width: "300px",
          height: "250px",
        }}
        open={openDeleteModal}
      >
        {deleteMsg === "" ? (
          <>
            <p>Delete `{props.item.name}`</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => {
                  setOpenDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFolderHandler();
                }}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p>{deleteMsg}</p>
            <button
              style={{ color: "white", backgroundColor: "red" }}
              onClick={() => {
                setOpenDeleteModal(false);
                window.location.reload();
                setDeleteMsg("");
              }}
            >
              ✗
            </button>
          </div>
        )}
      </dialog>

      <div
        style={{
          paddingLeft: `${props.level * 16}px`,
        }}
      >
        <Node
          item={props.item}
          selected={selected}
          level={props.level + 1}
          onToggle={toggleSelected}
          addFolder={addFolder}
          deleteFolder={deleteFolder}
        />

        {selected && renderBranches()}
      </div>
    </>
  );
};

export default Branch;
