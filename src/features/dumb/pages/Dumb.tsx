import { RootState } from "@/store";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDumbPostAPI } from "../api/dumb.api";
import { TPost } from "../interfaces";
import { getPostsList } from "../store/dumbSlice";

const DumbPage: FC = () => {
  const posts = useSelector((state: RootState) => state.dumb.value);
  const dispatch = useDispatch();

  useEffect(() => {
    getDumbPostAPI()
      .then((res) => {
        let dumb: any = res;
        dispatch(
          getPostsList(
            dumb.map((elt: any) => {
              let toReturn: TPost = {
                user: elt.userId,
                title: elt.title,
                body: elt.body,
              };
              return toReturn;
            })
          )
        );
      })
      .catch((err) => {
        console.log({ ...err });
      });
  }, []);

  return (
    <div className="dumb-page">
      <h1 style={{ margin: "10px" }}>Quelques posts</h1>
      {posts.map((post) => {
        return (
          <div style={{ marginBottom: "5px", padding: "10px 50px" }}>
            <div>Utilisateur {post.user}</div>
            <div>{post.title}</div>
            <div>{post.body}</div>
          </div>
        );
      })}
    </div>
  );
};
export default DumbPage;
