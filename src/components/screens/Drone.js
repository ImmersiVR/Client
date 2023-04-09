import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import background from "./back.jpg";
import M from "materialize-css";
import loc from "./placeholder.png";
import bin from "./dustbin.png";
import arrow from "./arrow.png";
export default function Drone() {
  const [role, setRole] = useState(1);
  const [drone, setDrone] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const options = [
    { value: "1", label: "Distance" },
    { value: "0", label: "Percentage" },
  ];
  useEffect(() => {
    if (role != null) {
      postDetails();
    }
  }, [role]);
  let goTO = (lat, lon) => {
    window.open(
      `https://www.google.com/maps/dir//${lat},${lon}/@${lat},${lon},19z`
    );
    //https://www.google.com/maps/dir/${lat},${lon}//@${lat},${lon},19z
  };
  const postDetails = () => {
    fetch("/getDrone", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.me) {
          console.log(data.me);
        }
      });
    getPosts();
  };
  const getPosts = () => {
    fetch("/getDronePosts", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temp: role,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        //   if (data.me) {
        console.log(data.me);
        setDrone(data.me);
        //   }
      });
  };
  const checkIn = (id, lat, lon, per, pho) => {
    fetch("/deleteDrone", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temp: id,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.me) {
          console.log(data.me);
        }
        fetch("/sendSms", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: state.name,
            num: state.num,
            role: state.role,
            loc: `https://www.google.com/maps/dir//${lat},${lon}/@${lat},${lon},19z`,
            percentage: per,
          }),
        })
          .then((res) => res.json())
          .then(async (data) => {
            if (data.me) {
              console.log(data.me);
            }
          });
      });
    // console.log(id);
    M.toast({
      html: "Hotspot Cleaned",
      classes: "toast-container green darken-1",
    });
    myRew(lat, lon, pho);
  };
  const myRew = (lat, lon, pho) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const d = new Date();

    fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt_NITR"),
      },
      body: JSON.stringify({
        title: `${lat} ${lon}`,
        body: `${d.getDate()} ${months[d.getMonth()]}`,
        pic: pho,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.rewards);
        localStorage.setItem(
          "user_NITR",
          JSON.stringify({ ...state, rewards: data.rewards })
        );
        dispatch({ type: "UPDATEREW", payload: data.rewards });
        // window.location.reload();
        postDetails();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div></div>
    // <div>
    //   <div
    //     style={{
    //       width: "300px",
    //       height: "10px",
    //       left: "95%",
    //       position: "sticky",
    //       marginTop: "10px",
    //     }}
    //   >
    //     <Select
    //       defaultValue={options[0]}
    //       maxControlHeight={190}
    //       onChange={(e) => setRole(e.value)}
    //       className="mysec2"
    //       options={options}
    //       theme={(theme) => ({
    //         ...theme,
    //         borderRadius: 0,
    //         colors: {
    //           ...theme.colors,
    //           primary25: "#b5fe83",
    //           primary: "grey",
    //         },
    //       })}
    //     />
    //   </div>

    //   <div
    //     style={{
    //       marginTop: "60px",

    //       marginLeft: "40px",
    //       marginRight: "20px",
    //     }}
    //   >
    //     {drone.map((item) => {
    //       return (
    //         <div
    //           className="card home-card mysec2 "
    //           key={item.id}
    //           style={{
    //             padding: "2px",
    //             height: "589px",
    //             width: "620px",
    //             borderRadius: "10px",
    //             paddingLeft: "0px",
    //             paddingRight: "0px",
    //             marginBottom: "45px",
    //           }}
    //         >
    //           <h5 style={{ paddingLeft: "20px" }}>
    //             <Link to={"////"}>{/* {item.postedBy.name} */}Drone@471</Link>{" "}
    //           </h5>
    //           <div className="card-image" style={{ margin: "2px" }}>
    //             <img
    //               src={item.image}
    //               alt=""
    //               style={{ height: "420px", borderRadius: "10px" }}
    //             />
    //           </div>
    //           <div
    //             className="card-content"
    //             style={{ margin: "3px", padding: "8px", height: "67px" }}
    //           >
    //             <div
    //               className="row"
    //               style={{ marginBottom: "0px", paddingBottom: "0px" }}
    //             >
    //               <div
    //                 className="col s5  left"
    //                 style={{ marginTop: "0px", paddingTop: "7px" }}
    //               >
    //                 <div
    //                   className="row myhov"
    //                   onClick={() => goTO(item.latitude, item.longitude)}
    //                   style={{ cursor: "pointer" }}
    //                 >
    //                   <img
    //                     src={loc}
    //                     style={{
    //                       width: "105px",
    //                       height: "40px",
    //                       paddingLeft: "65px",
    //                     }}
    //                     className="left"
    //                   />
    //                   <div className="col s6 ">
    //                     <div className="col s12 left ">
    //                       {Math.round(item.distance)}m
    //                     </div>
    //                     <div className="col s12 left">Distance</div>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div
    //                 className="col s6 right"
    //                 style={{ marginTop: "0px", paddingTop: "7px" }}
    //               >
    //                 <div className="row">
    //                   <img
    //                     src={bin}
    //                     style={{
    //                       width: "110px",
    //                       height: "40px",
    //                       paddingLeft: "70px",
    //                     }}
    //                     className="left"
    //                   />
    //                   <div className="col s7">
    //                     <div className="col s12 left bold">
    //                       {item.percentage} %
    //                     </div>
    //                     <div className="col s12 left">Garbage Score</div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div
    //             id="nav-btn2"
    //             style={{
    //               background:
    //                 "linear-gradient(90deg, #2cbbe8 0%, rgba(79, 191, 226, 0.4) 100%)",
    //               borderRadius: "0px 0px 10px 10px",
    //               margin: "0px",
    //               paddingTop: "8px",
    //               paddingBottom: "10px",
    //               textAlign: "center",
    //               cursor: "pointer",
    //             }}
    //             onClick={() => {
    //               checkIn(
    //                 item.id,
    //                 item.latitude,
    //                 item.longitude,
    //                 item.percentage,
    //                 item.image
    //               );
    //             }}
    //           >
    //             CHECKIN{"  "}
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
  );
}
