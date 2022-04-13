// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Decentralized {
  string public name;
  uint public postCount = 0;
  uint public fileCount = 0;
  uint public itemCount = 0;
  uint public movieCount = 0;
  uint public placeCount = 0;
  address payable constant public owner = payable(0xD07514cC003fa03c96A6C520051A7c58B49a0003);
  mapping(uint => Post) public posts;
  mapping(uint => File) public files;
  mapping(uint => Item) public items;
  mapping(uint => Movie) public movies;
  mapping(uint => Place) public places;

  struct Post{
    uint postId;
    string postHash;
    string postDescription;
    uint tipPostAmount;
    address payable poster;
  }

  struct Item{
    uint itemId;
    string itemName;
    string itemDescription;
    uint itemPrice;
    address payable itemOwner;
  }

  struct File{
    uint fileId;
    string fileName;
    string fileDescription;
    string fileHash;
    uint fileSize;
    uint fileUploadTime;
    address payable fileUploader;
  }

  struct Movie{
    uint movieId;
    uint moviePrice;
  }

  struct Place{
    int longitude;
    int latitude;
    uint confirmedCases;
    uint recoveredCases;
    uint deaths;
  }


  event PostCreated(
    uint postId,
    string postHash,
    string postDescription,
    uint tipPostAmount,
    address payable poster
  );

  event PostTipped(
    uint postId,
    string postHash,
    string postDescription,
    uint tipPostAmount,
    address payable poster
  );

  event PostCommented(
    uint postId,
    string postHash,
    string postDescription,
    uint tipPostAmount,
    address payable poster
  );

  event FileUploaded(
    uint fileId,
    string fileName,
    string fileDescription,
    string fileHash,
    uint fileSize,
    uint fileUploadTime,
    address payable fileUploader
  );

  event ItemUploaded(
    uint itemId,
    string itemName,
    string itemDescription,
    uint itemPrice,
    address payable itemOwner
  );

  event ItemBought(
    uint itemId,
    string itemName,
    string itemDescription,
    uint itemPrice,
    address payable itemOwner
  );

  event MovieBooked(
    uint movieId,
    uint moviePrice
  );

  event PlaceCreated(
    int longitude,
    int latitude,
    uint confirmedCases,
    uint recoveredCases,
    uint deaths
  );

  function uploadPost(string memory _postHash, string memory _postDescription) public {
    require(bytes(_postHash).length > 0);
    require(bytes(_postDescription).length > 0);
    require(msg.sender != address(0));
    postCount ++;
    posts[postCount] = Post(postCount, _postHash, _postDescription, 0, payable(msg.sender));
    emit PostCreated(postCount, _postHash, _postDescription, 0, payable(msg.sender));
  }


  function tipPostOwner(uint _postId) public payable {
    require(_postId > 0 && _postId <= postCount);
    Post memory _post = posts[_postId];
    address payable _poster = _post.poster;
    payable(_poster).transfer(msg.value);
    _post.tipPostAmount = _post.tipPostAmount + msg.value;
    posts[_postId] = _post;
    emit PostTipped(_postId, _post.postHash, _post.postDescription, _post.tipPostAmount, _poster);
  }

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileName, string memory _fileDescription) public {
    require(bytes(_fileHash).length > 0);
    require(bytes(_fileDescription).length > 0);
    require(bytes(_fileName).length > 0);
    require(msg.sender != address(0));
    require(_fileSize > 0);
    fileCount ++;
    files[fileCount] = File(fileCount, _fileName, _fileDescription, _fileHash, _fileSize, block.timestamp, payable(msg.sender));
    emit FileUploaded(fileCount, _fileName, _fileDescription, _fileHash, _fileSize, block.timestamp, payable(msg.sender));
  }

  function uploadItem(string memory _itemName, string memory _itemDescription, uint _itemPrice) public{
    require(bytes(_itemName).length > 0);
    require(bytes(_itemDescription).length > 0);
    require(_itemPrice > 0);
    require(msg.sender != address(0));
    itemCount ++;
    items[itemCount] = Item(itemCount,_itemName,_itemDescription,_itemPrice,payable(msg.sender));
    emit ItemUploaded(itemCount,_itemName,_itemDescription,_itemPrice,payable(msg.sender));
  }

  function buyItem(uint _itemId) public payable{
    require(_itemId > 0 && _itemId <= itemCount);
    Item memory _item = items[_itemId];
    address payable _itemUploader = _item.itemOwner;
    payable(_itemUploader).transfer(_item.itemPrice);
    delete items[_itemId];
    emit ItemBought(itemCount,_item.itemName,_item.itemDescription,_item.itemPrice,payable(msg.sender));
  }

  function addBookedMovie(uint _movieId) public payable{
    require(_movieId > 0);
    movieCount ++;
    address payable _owner = owner;
    payable(_owner).transfer(msg.value);
    movies[movieCount] = Movie(_movieId, msg.value);
    emit MovieBooked(_movieId, msg.value);
  }

  function addPlaceDetails(int _longitude, int _latitude, uint _confirmedCases, uint _recoveredCases, uint _deaths) public{
    placeCount ++;
    places[placeCount] = Place(_longitude, _latitude, _confirmedCases, _recoveredCases, _deaths);
    emit PlaceCreated(_longitude, _latitude, _confirmedCases, _recoveredCases, _deaths);
  }

}
