import React, { Component } from "react";
import OnTheGo from "./OnTheGo";

const google = window.google;
const gm = window.gm;

class RouteMap extends Component {
  state = {
    start: "",
    end: "Vancouver, BC",
    routeSummary: [],
    OnTheGo: false,
    hideButtons: true,
    showPicture: false
  };

  mapRef = React.createRef();

  componentDidMount() {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
    this.initMap();
    //gm.info.getCurrentPosition()
    gm.info.getCurrentPosition(() => {
      //console.log("POS", pos);
      // var start = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      var start = { lat: 34.052235, lng: -118.243683 };

      this.setState({ start }, this.initMap);
    });
    // this.setState({start});
  }

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => {});
  };

  initMap = () => {
    var map = new google.maps.Map(this.mapRef.current, {
      zoom: 6,
      center: new google.maps.LatLng(this.state.start.lat, this.state.start.lng)
    });

    var marker = new google.maps.Marker({
      // The below line is equivalent to writing:
      // position: new google.maps.LatLng(-34.397, 150.644)
      position: { lat: 34.052235, lng: -118.243683 },
      map: map
    });

    this.directionsDisplay.setMap(map, marker);
  };

  onSubmit = () => {
    this.calculateAndDisplayRoute();
    this.setState({ showPicture: true });
  };

  handleYes = () => {
    const OnTheGo = this.state.OnTheGo;
    const hideButtons = this.state.hideButtons;
    this.setState({
      OnTheGo: !OnTheGo,
      hideButtons: !hideButtons
    });
  };

  toggle = () => {
    this.props.toggle();
  };

  calculateAndDisplayRoute = () => {
    // var waypts = [];
    // var checkboxArray = document.getElementById("waypoints");
    // for (var i = 0; i < checkboxArray.length; i++) {
    //   if (checkboxArray.options[i].selected) {
    //     waypts.push({
    //       location: checkboxArray[i].value,
    //       stopover: true
    //     });
    //   }
    // }

    this.directionsService.route(
      {
        origin: this.state.start,
        destination: this.state.end,
        // waypoints: waypts,
        // optimizeWaypoints: true,
        travelMode: "DRIVING"
      },
      (response, status) => {
        if (status === "OK") {
          this.directionsDisplay.setDirections(response);
          var route = response.routes[0];

          var routeSummary = route.legs.map(r => ({
            startaddress: r.start_address,
            endAddress: r.end_address,
            distance: r.distance.text
          }));

          this.setState({ routeSummary });
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <button onClick={this.toggle}>Back</button>
          </div>
          <div ref={this.mapRef} style={{ width: "500px", height: "400px" }} />
          <br />
          <div id="right-panel">
            <div style={{ position: "fixed", top: 0, right: "59px" }}>
              <b style={{ fontSize: "15px" }}>Start: </b>
              <select
                name="start"
                value={this.state.start}
                onChange={this.onChange}
              >
                <option value="Rosemead,CA">Rosemead, CA</option>
                <option value="Los Angeles, CA">Los Angeles, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Miami, FL">Miami, FL</option>
              </select>
              <br />
              <b style={{ fontSize: "15px" }}>End: </b>
              <select
                name="end"
                value={this.state.end}
                onChange={this.onChange}
              >
                <option value="Los Angeles, CA">Los Angeles, CA</option>
                <option value="Seattle, WA">Seattle, WA</option>
                <option value="San Diego, CA">San Diego, CA</option>
                <option value="Thousand Oaks, CA">Thousand Oaks, CA</option>
              </select>
              {"   "}
              {"   "}
              <input type="submit" id="submit" onClick={this.onSubmit} />
              {this.state.showPicture ? (
                <img
                  src="/tolls.png"
                  style={{
                    position: "fixed",
                    right: "37px",
                    width: "38%",
                    top: "109px"
                  }}
                  alt=""
                />
              ) : null}
            </div>
            {/* {this.state.routeSummary.map(r => (
              <div>{JSON.stringify(r)}</div>
              // <div>{r.start}</div> */}
          </div>
        </div>

        <div>
          {this.state.hideButtons && (
            <span>
              Toll Route Available
              <button onClick={this.handleYes}>Yes</button>
              <button>No</button>
            </span>
          )}
          {this.state.OnTheGo && <OnTheGo />}
        </div>
      </div>
    );
  }
}

export default RouteMap;
