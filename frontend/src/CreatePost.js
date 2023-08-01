import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const {
    REACT_APP_CLOUDINARY_POST_API,
    REACT_APP_API_SERVER,
    REACT_APP_CLOUD_NAME,
  } = process.env;
  console.log(REACT_APP_CLOUDINARY_POST_API);
  const navigate = useNavigate();

  let date = new Date();

  const [img, setImg] = useState("");
  const [uploadStatus, setUploadStatus] = useState(false);
  let [formData, setFormData] = useState({
    img: "",
    author: "",
    location: "",
    description: "",
    date: date.toLocaleDateString("en-IN"),
  });

  const cdnApi = async (files) => {
    setImg("");
    const data = new FormData();
    data.append("file", files);
    data.append("upload_preset", "instaclone");
    data.append("cloud_name", REACT_APP_CLOUD_NAME);

    const cdnUpload = await fetch(
      "https://api.cloudinary.com/v1_1/dxwzjsp7z/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const cdnJSON = await cdnUpload.json();

    setImg(cdnJSON.secure_url);
  };

  const postData = async () => {
    await fetch(`${REACT_APP_API_SERVER}/createPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function updateIMG() {
    console.log("up", img);
    setFormData({
      ...formData,
      img: img,
    });
    console.log(formData.img);
  }
  return (
    <form
      className="post-cont"
      method="post"
      action="#"
      onSubmit={async (e) => {
        e.preventDefault();
        console.log(formData);
        await postData();
        navigate("/postview");
      }}
    >
      <div className="create-post">
        <h2>Create New Post</h2>
        <div className="input-div">
          <input
            id="file"
            type="file"
            name="profile"
            className="input-file"
            onChange={async (e) => {
              setUploadStatus(true);
              console.log(e.target.files[0]);
              await cdnApi(e.target.files[0]);
            }}
          />
        </div>
        {img === "" && uploadStatus ? (
          <div>Please Wait While Image is Uploading...</div>
        ) : (
          ""
        )}
        <input
          type="text"
          placeholder="Author Name"
          name="author"
          className="input"
          onChange={(e) => {
            setFormData({
              ...formData,
              author: e.target.value,
            });
          }}
        />
        <input
          type="text"
          placeholder="Location"
          name="location"
          className="input"
          onChange={(e) => {
            setFormData({
              ...formData,
              location: e.target.value,
            });
          }}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          className="desc"
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value,
            });
          }}
        />
        <button type="submit" className="btn" onClick={() => updateIMG()}>
          Post
        </button>
      </div>
    </form>
  );
};

export default CreatePost;