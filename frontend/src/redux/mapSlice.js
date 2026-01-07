import { createSlice } from "@reduxjs/toolkit"
import { act } from "react";

const mapSlice =createSlice({
   name: "user",
   initialState: {
     location: {
      lat: null,
      lng: null,
     },
     address: null,
   },
   reducers: {
     setLocation: (state, action) => {
      const {lat, lng} = action.payload;
      state.location.lat = lat;
      state.location.lng = lng;
     },
     setAddress: (state, action) => {
      state.address = action.payload
     }

   }
})

export const {setAddress, setLocation} = mapSlice.actions
export default mapSlice.reducer