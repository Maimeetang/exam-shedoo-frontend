import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

export default function Spinner() {
  return (
    <Flex
      align="center"
      gap="middle"
      className="item-center justify-center h-screen"
    >
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </Flex>
  );
}
