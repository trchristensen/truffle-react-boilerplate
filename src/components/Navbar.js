import React, { Component } from "react";
import Identicon from "identicon.js";
import MetaMaskLogo from "../metamask.02e3ec27.png";
import { Box } from "@chakra-ui/layout";
import { Image, Text } from "@chakra-ui/react";

class Navbar extends Component {  

  render() {
    return (
      <Box
        className="navbar"
        w={"full"}
        d={"flex"}
        justifyContent={"space-between"}
        // position={"fixed"}
        // top={0}
        bg={"gray.200"}
        flexWrap={"nowrap"}
        py={2}
        px={4}
        fontWeight={"600"}
      >
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          dapp
        </a>
        <Box
          d={"flex"}
          flexWrap={"nowrap"}
          justifyContent={"center"}
          alignItems={"center"}
          bg={"gray.700"}
          rounded={"full"}
        >
          <Box
            fontSize={"sm"}
            color={"gray.400"}
            d={"flex"}
            alignItems={"center"}
            p={2}
            px={4}
          >
            Ξ{this.props.balance}
          </Box>
          <Box
            d={"flex"}
            alignItems={"center"}
            bg={"gray.500"}
            p={2}
            px={4}
            rounded={"full"}
          >
            <Text id="account" pr={4} color={"gray.100"}>
              {this.props.account.slice(0, 6)}...{this.props.account.slice(-4)}
            </Text>
            <Image src={MetaMaskLogo} w={"20px"} h={"20px"} />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Navbar;
