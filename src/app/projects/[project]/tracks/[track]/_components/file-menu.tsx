import { FileWithMeta } from "@/utils/typing-utils/files";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete, MdFileDownload, MdInfo } from "react-icons/md";

export function FileMenu({ file }: { file: FileWithMeta }) {
  return (
    <Menu placement="bottom-start">
      <MenuHandler>
        <IconButton variant="text">
          <HiOutlineDotsVertical
            size="25"
            className="rotate-90 cursor-pointer"
          />
        </IconButton>
      </MenuHandler>
      <MenuList>
        <MenuItem icon={<MdFileDownload size="15" />}>Download</MenuItem>
        <MenuItem icon={<MdDelete size="15" />}>Delete</MenuItem>
        <MenuItem icon={<MdInfo size="15" />}>Get info</MenuItem>
      </MenuList>
    </Menu>
  );
}
