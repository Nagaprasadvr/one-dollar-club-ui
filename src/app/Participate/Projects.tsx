import { AppContext } from "@/components/Context/AppContext";
import ApexChartComponent from "@/components/HelperComponents/ApexChartComponent";
import { Card } from "@/components/HelperComponents/Card";
import { Message } from "@/components/HelperComponents/Message";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { PROJECTS_TO_PLAY } from "@/utils/constants";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useContext } from "react";
import toast from "react-hot-toast";

export const Projects = () => {
  const { poolConfig, sdk } = useContext(AppContext);

  if (!sdk || !poolConfig) {
    return <Message message="Loading..." />;
  }

  const handlePoolDeposit = async () => {
    if (sdk) {
      toast.loading("Depositing to play...", {
        id: "depositing",
      });
      try {
        await poolConfig.deposit();
        toast.success("Deposit successful", {
          id: "depositing",
        });
      } catch (err) {
        toast.error("Error while depositing to play", {
          id: "depositing",
        });
      }
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        width: "80%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <Typography variant="h5" fontWeight={"bold"}>
          Projects to Play
        </Typography>
        <Button onClick={handlePoolDeposit}>Play</Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          padding: "10px",
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
          mb: "50px",
          mt: "20px",
        }}
      >
        {PROJECTS_TO_PLAY.map((project) => (
          <Card
            key={project}
            sx={{
              width: "90%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 10px",
                gap: "40px",
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              <TextWithValue text="Project" value={project} gap="5px" />
              <TextWithValue
                text="Price"
                value={`$${Math.floor(
                  Math.random() * 100
                )}`.toLocaleLowerCase()}
                gap="5px"
              />
              <TextWithValue
                text="24 hour change"
                value={Math.floor(Math.random() * 100).toLocaleString()}
                gap="5px"
              />
              <ApexChartComponent />
              <Button>Create Position</Button>
            </Box>

            <Divider
              sx={{
                color: "white",
                height: "1px",
                width: "100%",
                backgroundColor: "white",
              }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridColumnGap: "10px",
                gridRowGap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextWithValue text="Position" value={"Short"} gap="5px" />
              <TextWithValue
                text="Points Allocated"
                value={(Math.random() * 10).toLocaleString()}
                gap="5px"
              />
              <TextWithValue
                text="Leverage"
                value={Math.floor(Math.random() * 10).toLocaleString() + "x"}
                gap="5px"
              />
              <TextWithValue
                text="Entry Price"
                value={`$${Math.floor(
                  Math.random() * 100
                )}`.toLocaleLowerCase()}
                gap="5px"
              />
              <TextWithValue
                text="Current Price"
                value={`$${Math.floor(
                  Math.random() * 100
                )}`.toLocaleLowerCase()}
                gap="5px"
              />
              <TextWithValue
                text="Percentage Change"
                value={Math.floor(Math.random() * 100).toLocaleString() + "%"}
                gap="5px"
              />
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
