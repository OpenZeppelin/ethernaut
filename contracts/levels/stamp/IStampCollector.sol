pragma solidity ^0.5.0;

interface IStampCollector {
  function isCollected(address stamp) external returns (bool);
  function collectStamp(address stamp) external;
}