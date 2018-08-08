pragma solidity ^0.4.24;

contract HashStorage {
    // Store struct properties as string for now
    struct Video {
        string timestamp;
        string user;
    }
    
    // Only the contract manager can invoke this contract
    address public manager;
    
    // The hash is the key of the mapping, the value is a Video type
    mapping(string => uint) private videoMap;
    
    // The index where the video should be stored in the videos array
    uint private index;
    
    // The map contains the index where the video is stored in the array
    Video[] public videos;
    
    // Only the contract manager can inoke restricted methods
    modifier restricted() {
        require(msg.sender == manager, "Only the manager can invoke");
        _;
    }
    
    constructor() public {
        // The creator of the contract is the manager
        manager = msg.sender;
        
        // A mapping will return 0 by default if a hash is not found in the mapping, so start 
        // array at index 1 
        index = 1;
        
        // Adding a dummy video to videos[0], so that the push method can be used in storeHash
        Video memory video = Video({
            timestamp: "FALSE",
            user: "FALSE"
        });
        
        videos.push(video);
    }
    
    // Stores a new hash inside the contract 
    function storeHash(string hash, string timestamp, string user) public restricted {
        // A duplicate hash cannot exist
        require(videoMap[hash] == 0, "Hash value already present");
        // Create a new video with the passed in arguments
        Video memory video = Video({
            timestamp: timestamp,
            user: user
        });
        
        // Store the hash in the mapping with a reference to the index
        videoMap[hash] = index;
        
        // Store the video at the given index
        videos.push(video);
        index++;
    }
    
    // Given a hash return a string representing the video (custom struct types are not
    // valid return types)
    function getVideo(string hash) public restricted view returns(string) {
        // The integer 0 will be returned if the hash is not found in the mapping
        uint videoIndex = videoMap[hash];
        Video memory video = videos[videoIndex];
        
        // Cannot concatinate strings in solididty natively, so return the user for now
        string memory user = video.user;
        return user;
    }
}
