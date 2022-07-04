import { useAppDispatch } from "@/store";
import { dumbAsyncAction } from "@/store/reducers/dumb/dumb.action";
import {
  selectDumbError,
  selectDumbLoading,
  selectDumbValue,
} from "@/store/reducers/dumb/dumb.selector";
import { FC, ReactNode, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";

type DumbPageProps = ConnectedProps<typeof connector>;
const DumbPage: FC<DumbPageProps> = ({ posts, loading, error }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dumbAsyncAction({ param: 1 }));
  }, []);

  const renderButtons = () => {
    let toReturn: ReactNode[] = [];
    for (let i = 0; i < 10; i++) {
      toReturn.push(
        <button
          type="button"
          onClick={() => {
            dispatch(dumbAsyncAction({ param: i + 1 }));
          }}
          style={{
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30px",
            height: "30px",
            borderRadius: "4px",
            backgroundColor: "blueviolet",
            cursor: "pointer",
            marginLeft: "5px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {i + 1}
        </button>
      );
    }
    return toReturn;
  };

  const renderPosts = () => {
    return posts.map((post) => {
      return (
        <div style={{ marginBottom: "5px", padding: "10px 50px" }}>
          <div>Utilisateur {post.user}</div>
          <div>{post.title}</div>
          <div>{post.body}</div>
        </div>
      );
    });
  };

  return (
    <div className="dumb-page">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ margin: "10px" }}>Quelques posts</h1>
        <div style={{ margin: "10px", display: "flex" }}>{renderButtons()}</div>
      </div>

      {loading === "pending"
        ? "loading..."
        : loading === "failed"
        ? error
        : renderPosts()}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  posts: selectDumbValue,
  loading: selectDumbLoading,
  error: selectDumbError,
});
const connector = connect(mapStateToProps);
export default connector(DumbPage);
