import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSpotThunk } from "../../store/spots";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { deleteSpotThunk } from "../../store/spots";
import { getSpotThunk } from "../../store/currentSpot";
import "./EditSpotForm.css";

function EditSpotForm() {
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [st, setSt] = useState(null);
  const [country, setCountry] = useState(null);
  const [description, setDescription] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isOwner, setIsOwner] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(getSpotThunk(spotId)).catch((res) => history.push("/404"));
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.currentSpot);

  //fixes bug when refreshing page spot was undefined and gave an error
  useEffect(() => {
    if (spot) {
      if (name === null) setName(spot.name);
      if (price === null) setPrice(spot.price);
      if (address === null) setAddress(spot.address);
      if (city === null) setCity(spot.city);
      if (st === null) setSt(spot.state);
      if (country === null) setCountry(spot.country);
      if (description === null) setDescription(spot.description);
    }
  }, [spot]);

  //following lines along with the Redirect tag in return below, redirects user to spot details page if he is not the owner of the spot
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (spot && sessionUser && sessionUser.id !== spot.ownerId) {
      setIsOwner(false);
    } else {
      setIsOwner(true);
    }
  }, [spot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSpot = {
      name,
      price,
      address,
      city,
      state: st,
      country,
      description,
    };

    setErrors([]);

    dispatch(editSpotThunk(newSpot, spotId))
      .then(() => history.push(`/spots/${spotId}`))
      .catch(async (res) => {
        const data = await res.json();
        if (data.statusCode === 404) {
          history.push("/404");
        }
        if (data && data.errors) {
          setErrors(Object.values(data.errors));
          console.log(errors);
        } else if (data.message) {
          setErrors([data.message]);
        }
      });
  };

  const deleteSpot = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this listing? You can not recover the listing after deletion."
      )
    ) {
      dispatch(deleteSpotThunk(spotId))
        .then(() => history.push("/"))
        .catch(() => history.push("/404"));
    }
  };

  console.log(spot);
  return (
    <>
      {!isOwner && <Redirect to={`/spots/${spotId}`} />}
      {spot && (
        <div className="edit_form_container flex top">
          <form onSubmit={handleSubmit} className="edit_form flex">
            <div className="title">Edit Your Listing</div>
            <ul className="errors">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label className="flex">
              <span className="input_label">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={49}
                className="input_top"
              />
            </label>
            <label className="flex">
              <span className="input_label">Price per night (USD)</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={1}
              />
            </label>
            <label className="flex">
              <span className="input_label">Address</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <label className="flex">
              <span className="input_label">City</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>
            <label className="flex">
              <span className="input_label">State</span>
              <input
                type="text"
                value={st}
                onChange={(e) => setSt(e.target.value)}
                required
              />
            </label>
            <label className="flex">
              <span className="input_label">Country</span>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </label>
            <label className="flex">
              <span className="input_label">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                required
                className="input_description input_bottom"
              />
            </label>
            <button type="submit" className="confirm_changes_btn">
              Confirm Changes
            </button>
          </form>

          <button className="delete_spot_btn" onClick={deleteSpot}>
            Delete Listing
          </button>
        </div>
      )}
    </>
  );
}

export default EditSpotForm;
