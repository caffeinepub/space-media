import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

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

  module DownloadedItem {
    public func compare(a : DownloadedItem, b : DownloadedItem) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  let passengers = Map.empty<Text, Passenger>();
  let downloads = Map.empty<Text, DownloadedItem>();
  let settings = Map.empty<Text, AppSettings>();
  let staffSecretKey = "SPACE2024";

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
};
