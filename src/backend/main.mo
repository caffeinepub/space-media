import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";

import Nat "mo:core/Nat";


actor {
  public type Passenger = {
    id : Text;
    name : Text;
    role : Text;
    tripId : Text;
    createdAt : Int;
  };

  public type DownloadedItem = {
    id : Text;
    passengerId : Text;
    mediaType : Text;
    title : Text;
    artworkUrl : Text;
    downloadedAt : Int;
    expiresAt : Int;
    genre : Text;
    language : Text;
    artist : Text;
    album : Text;
    tags : [Text];
  };

  public type AppSettings = {
    passengerId : Text;
    theme : Text;
    downloadQuality : Text;
  };

  public type AudioTrack = {
    id : Text;
    language : Text;
    langCode : Text;
    audioLabel : Text;
    isDefault : Bool;
  };

  public type StudioVideo = {
    id : Text;
    title : Text;
    description : Text;
    genre : Text;
    ageRating : Text;
    primaryLanguage : Text;
    posterUrl : Text;
    hlsMasterUrl : Text;
    processingStatus : Text;
    audioTracks : [AudioTrack];
    dateAdded : Int;
    duration : Text;
    isPublished : Bool;
  };

  public type StudioMusic = {
    id : Text;
    title : Text;
    artist : Text;
    album : Text;
    genre : Text;
    language : Text;
    coverArt : Text;
    dateAdded : Int;
    duration : Text;
    isPublished : Bool;
  };

  module DownloadedItem {
    public func compare(a : DownloadedItem, b : DownloadedItem) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  let passengers = Map.empty<Text, Passenger>();
  let downloads = Map.empty<Text, DownloadedItem>();
  let settings = Map.empty<Text, AppSettings>();
  let studioVideos = Map.empty<Text, StudioVideo>();
  let studioMusic = Map.empty<Text, StudioMusic>();
  let staffSecretKey = "SPACE2024";
  let managerKey = "MANAGER2024";

  public shared ({ caller }) func createPassenger(id : Text, name : Text, role : Text, tripId : Text) : async () {
    let passenger : Passenger = {
      id;
      name;
      role;
      tripId;
      createdAt = Time.now();
    };
    passengers.add(id, passenger);
  };

  public query ({ caller }) func getPassenger(passengerId : Text) : async Passenger {
    switch (passengers.get(passengerId)) {
      case (null) { Runtime.trap("Passenger does not exist") };
      case (?passenger) { passenger };
    };
  };

  public query ({ caller }) func listPassengers() : async [Passenger] {
    passengers.values().toArray();
  };

  public shared ({ caller }) func addDownload(item : DownloadedItem) : async () {
    downloads.add(item.id, item);
  };

  public query ({ caller }) func getDownloads(passengerId : Text) : async [DownloadedItem] {
    downloads.values().toArray().filter(func(item) { item.passengerId == passengerId });
  };

  public shared ({ caller }) func deleteDownload(id : Text) : async () {
    downloads.remove(id);
  };

  public shared ({ caller }) func renewDownload(id : Text, newExpiresAt : Int) : async () {
    switch (downloads.get(id)) {
      case (null) { Runtime.trap("Download does not exist") };
      case (?download) {
        let updatedDownload = { download with expiresAt = newExpiresAt };
        downloads.add(id, updatedDownload);
      };
    };
  };

  public shared ({ caller }) func validateStaffKey(key : Text) : async Bool {
    key == staffSecretKey;
  };

  public shared ({ caller }) func validateManagerKey(key : Text) : async Bool {
    key == managerKey;
  };

  public query ({ caller }) func getSettings(passengerId : Text) : async ?AppSettings {
    settings.get(passengerId);
  };

  public shared ({ caller }) func saveSettings(passengerId : Text, theme : Text, downloadQuality : Text) : async () {
    let appSettings : AppSettings = {
      passengerId;
      theme;
      downloadQuality;
    };
    settings.add(passengerId, appSettings);
  };

  public shared ({ caller }) func searchDownloads(
    passengerId : Text,
    searchTerm : Text,
    typeFilter : ?Text,
  ) : async [DownloadedItem] {
    let resultsList = List.empty<DownloadedItem>();

    for ((_, item) in downloads.entries()) {
      if (item.passengerId == passengerId) {
        let matchesType = switch (typeFilter) {
          case (null) { true };
          case (?filterMediaType) { item.mediaType == filterMediaType };
        };

        let matchesSearch = item.title.contains(#text searchTerm) or
          item.genre.contains(#text searchTerm) or
          item.artist.contains(#text searchTerm) or
          item.album.contains(#text searchTerm);

        if (matchesType and matchesSearch) {
          resultsList.add(item);
        };
      };
    };

    resultsList.toArray().sort();
  };

  // Studio Video Management
  public shared ({ caller }) func createStudioVideo(video : StudioVideo) : async () {
    studioVideos.add(video.id, video);
  };

  public query ({ caller }) func getStudioVideo(id : Text) : async StudioVideo {
    switch (studioVideos.get(id)) {
      case (null) { Runtime.trap("Studio video does not exist") };
      case (?video) { video };
    };
  };

  public query ({ caller }) func listStudioVideos() : async [StudioVideo] {
    let iter = studioVideos.values();
    iter.toArray();
  };

  public shared ({ caller }) func updateStudioVideo(
    id : Text,
    title : Text,
    description : Text,
    genre : Text,
    ageRating : Text,
    primaryLanguage : Text,
    posterUrl : Text,
    hlsMasterUrl : Text,
    processingStatus : Text,
    isPublished : Bool,
  ) : async () {
    switch (studioVideos.get(id)) {
      case (null) { Runtime.trap("Studio video does not exist") };
      case (?video) {
        let updatedVideo = {
          video with
          title;
          description;
          genre;
          ageRating;
          primaryLanguage;
          posterUrl;
          hlsMasterUrl;
          processingStatus;
          isPublished;
        };
        studioVideos.add(id, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func deleteStudioVideo(id : Text) : async () {
    studioVideos.remove(id);
  };

  public shared ({ caller }) func addAudioTrack(videoId : Text, track : AudioTrack) : async () {
    switch (studioVideos.get(videoId)) {
      case (null) { Runtime.trap("Studio video does not exist") };
      case (?video) {
        let updatedTracks = video.audioTracks.concat([track]);
        let updatedVideo = { video with audioTracks = updatedTracks };
        studioVideos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func removeAudioTrack(videoId : Text, trackId : Text) : async () {
    switch (studioVideos.get(videoId)) {
      case (null) { Runtime.trap("Studio video does not exist") };
      case (?video) {
        let filteredTracks = video.audioTracks.filter(func(track) { track.id != trackId });
        let updatedVideo = { video with audioTracks = filteredTracks };
        studioVideos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func setDefaultAudioTrack(videoId : Text, trackId : Text) : async () {
    switch (studioVideos.get(videoId)) {
      case (null) { Runtime.trap("Studio video does not exist") };
      case (?video) {
        let updatedTracks = video.audioTracks.map(
          func(track) {
            if (track.id == trackId) { { track with isDefault = true } } else {
              { track with isDefault = false };
            };
          }
        );
        let updatedVideo = { video with audioTracks = updatedTracks };
        studioVideos.add(videoId, updatedVideo);
      };
    };
  };

  // Studio Music Management
  public shared ({ caller }) func createStudioMusic(music : StudioMusic) : async () {
    studioMusic.add(music.id, music);
  };

  public query ({ caller }) func getStudioMusic(id : Text) : async StudioMusic {
    switch (studioMusic.get(id)) {
      case (null) { Runtime.trap("Studio music does not exist") };
      case (?music) { music };
    };
  };

  public query ({ caller }) func listStudioMusic() : async [StudioMusic] {
    studioMusic.values().toArray();
  };

  public shared ({ caller }) func updateStudioMusic(
    id : Text,
    title : Text,
    artist : Text,
    album : Text,
    genre : Text,
    language : Text,
    coverArt : Text,
    isPublished : Bool,
  ) : async () {
    switch (studioMusic.get(id)) {
      case (null) { Runtime.trap("Studio music does not exist") };
      case (?music) {
        let updatedMusic = {
          music with
          title;
          artist;
          album;
          genre;
          language;
          coverArt;
          isPublished;
        };
        studioMusic.add(id, updatedMusic);
      };
    };
  };

  public shared ({ caller }) func deleteStudioMusic(id : Text) : async () {
    studioMusic.remove(id);
  };
};
