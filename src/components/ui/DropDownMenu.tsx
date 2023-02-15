import { useState } from "react";

const DropDownMenu = ({ shownContent, hiddenContent }) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  return (
    <>
      <div onClick={() => setShowContent(!showContent)}>{shownContent}</div>
      {showContent ? hiddenContent : null}
    </>
  );
};
export default DropDownMenu;
