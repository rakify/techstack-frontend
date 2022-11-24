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

  // function to add new folder
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

  // function to delete folder
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

  // Get childs of this id only when id changes
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

  // Checking if there exists children
  const hasChildren = childs && childs.length !== 0;

  // If folder selected render child accordingly or show no folder msg
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

  // handle folder selection
  const handleSelected = () => {
    setSelected((prev) => !prev);
  };

  // initialize add folder from node
  const addFolder = () => {
    setOpenAddModal(true);
    setParentName(props.item.name);
    setParentId(props.item.id);
  };

  // initialize delete folder from node
  const deleteFolder = () => {
    setOpenDeleteModal(true);
  };

  return (
    <>
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
        {/* show form to input folder name to add, if submits then show result*/}
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
                    setParentId("");
                    setParentName("");
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

      {/* Dialog to Delete, if submits show result */}
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
                  setOpenDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                style={{ cursor: "pointer" }}
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
              style={{
                color: "white",
                backgroundColor: "red",
                cursor: "pointer",
              }}
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
          onToggle={handleSelected}
          addFolder={addFolder}
          deleteFolder={deleteFolder}
        />

        {selected && renderBranches()}
      </div>
    </>
  );
};

export default Branch;
