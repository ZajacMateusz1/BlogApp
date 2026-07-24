import { useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import UserPosts from "../components/UserPosts";

import FollowListModal from "../components/FollowListModal";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const [modal, setModal] = useState<"followers" | "following" | null>(null);
  const handleOpenModal = (type: "followers" | "following") => {
    setModal(type);
  };
  const handleCloseModal = () => {
    setModal(null);
  };
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <UserProfile handleOpenModal={handleOpenModal} profileId={userId} />
        <UserPosts userId={userId} />
      </div>
      {modal && (
        <FollowListModal
          modalType={modal}
          userId={userId}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
}
