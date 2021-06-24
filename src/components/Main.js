import React, { useState } from "react";
import {
  Container,
  Box,
  Text,
  Image,
  Button,
  Input,
  FormControl,
} from "@chakra-ui/react";
import moment from "moment";
import {ipfs, captureFile, tipImageOwner } from "../methods";

const Main = (props) => {
  const [imageDescription, setImageDescription] = useState("");
  const [buffer, setBuffer] = useState(null);

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      console.log("buffer", Buffer(reader.result));
      setBuffer(Buffer(reader.result));
    };
  };


const uploadImage = (buffer, description, smartContract, account) => {
  console.log("Submitting file to ipfs...");
  let timestamp = new Date().getTime().toString();

  console.log({
    buffer,
    description,
    smartContract,
    account,
  });
  //adding file to the IPFS
  ipfs.add(buffer, (error, result) => {
    console.log("Ipfs result", result);
    if (error) {
      console.error(error);
      return;
    }
    smartContract.methods
      .uploadImage(result[0].hash, description, timestamp)
      .send({
        from: account,
      })
      .on("transactionHash", (hash) => {
        return {
          loading: false,
          hash: hash,
        };
      });
  });
};  

  return (
    <Container w={"full"} mt={5} className="container-fluid">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
            <Text mb={2} as={"h2"} fontSize={"lg"}>
              Share Image
            </Text>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                uploadImage(buffer, imageDescription, props.data.smartContract, props.data.account);
              }}
            >
              <FormControl mb={2}>
                <Input
                  type="file"
                  accept=".jpg, .jpeg, .png, .bmp, .gif"
                  onChange={(e) => captureFile(e)}
                />
              </FormControl>

              <FormControl mb={2}>
                <Input
                  id="imageDescription"
                  type="text"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  className="form-control"
                  placeholder="Image description..."
                  required
                />
              </FormControl>
              <FormControl mb={2}>
                <Button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                >
                  Upload
                </Button>
              </FormControl>
            </form>
            <p>&nbsp;</p>
            {props.data.images.map((image, key) => {
              return (
                <Box
                  rounded={"lg"}
                  overflow={"hidden"}
                  mb={4}
                  borderWidth={1}
                  className="card mb-4"
                  key={key}
                >
                  <Box
                    p={2}
                    bg={"gray.100"}
                    className="card-header"
                    d={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <Text>
                        {image.author.slice(0, 6)}...{image.author.slice(-4)}
                      </Text>

                      <Text fontSize={"sm"}>
                        {moment(parseFloat(image.timestamp)).fromNow()}
                      </Text>
                    </Box>
                  </Box>
                  <Box id="imageList" className="list-group list-group-flush">
                    <Box
                      p={2}
                      py={4}
                      d={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      className="list-group-item"
                    >
                      <Image
                        w={"full"}
                        src={`https://ipfs.infura.io/ipfs/${image.hash}`}
                        style={{ maxWidth: "620px" }}
                      />
                      <Text>{image.description}</Text>
                    </Box>
                    <Box
                      p={1}
                      px={2}
                      borderTopWidth={1}
                      d={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      key={key}
                      className="list-group-item py-2"
                    >
                      <small className="float-left mt-1 text-muted">
                        TIPS:{" "}
                        {window.web3.utils.fromWei(
                          image.tipAmount.toString(),
                          "Ether"
                        )}{" "}
                        ETH
                      </small>
                      <Button
                        variant={"ghost"}
                        _hover={{ variant: "ghost" }}
                        p={2}
                        fontSize={"sm"}
                        name={image.id}
                        onClick={(event) => {
                          let tipAmount = window.web3.utils.toWei(
                            "0.01",
                            "Ether"
                          );
                          console.log(image);
                          console.log(event.target.name, tipAmount);
                          tipImageOwner(event.target.name, tipAmount);
                        }}
                      >
                        TIP 0.01 ETH
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </div>
        </main>
      </div>
    </Container>
  );
};

export default Main;
