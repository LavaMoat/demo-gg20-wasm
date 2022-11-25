import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ButtonGroup,
  Button,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

import { SignTxReceipt } from "../types";
import { encode, download } from "../utils";
import { loadTransactionReceipts, receiptsSelector } from "../store/receipts";
import {
  setDialogVisible,
  CONFIRM_DELETE_MESSAGE_PROOF,
} from "../store/dialogs";

type TransactionReceiptsProps = {
  address: string;
};

export default function TransactionReceipts(props: TransactionReceiptsProps) {
  const dispatch = useDispatch();
  const { address } = props;
  const { transactions } = useSelector(receiptsSelector);
  const items: SignTxReceipt[] = transactions[address] || [];

  useEffect(() => {
    const getTransactionReceipts = async () => {
      await dispatch(loadTransactionReceipts());
    };
    getTransactionReceipts();
  }, []);

  const onExportTransactionReceipt = (receipt: SignTxReceipt) => {
    const dt = new Date();
    dt.setTime(receipt.timestamp);
    const fileName = `${address}-${receipt.value.transactionHash}-${dt.toISOString()}.json`;
    const buffer = encode(JSON.stringify(receipt, undefined, 2));
    download(fileName, buffer);
  };

  const onDeleteTransactionReceipt = (receipt: SignTxReceipt) => {
    /*
    dispatch(
      setDialogVisible([CONFIRM_DELETE_MESSAGE_PROOF, true, [address, receipt]])
    );
    */
  };

  if (items.length === 0) {
    return null;
  }

  /*
  */


  /*
            <ListItemText secondary={`Approved ${formatDateDistance()} ago`}>
              {(proof.value as SignMessage).message}
            </ListItemText>
  */

  return (
    <List
      component="div"
      subheader={<ListSubheader component="div">Receipts</ListSubheader>}
    >
      {items.map((receipt: SignTxReceipt, index: number) => {
        const formatDateDistance = () => {
          const dt = new Date();
          dt.setTime(receipt.timestamp);
          return formatDistanceToNow(dt);
        };

        return (
          <ListItem key={index}>
            <ListItemText secondary={`Settled ${formatDateDistance()} ago`}>
              {receipt.amount} ETH to {receipt.value.to}
            </ListItemText>
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="transaction receipt actions"
            >
              <Button onClick={() => onExportTransactionReceipt(receipt)}>
                Export
              </Button>
              <Button
                color="error"
                onClick={() => onDeleteTransactionReceipt(receipt)}>
                Delete
              </Button>
            </ButtonGroup>
          </ListItem>
        );
      })}
    </List>
  );
}
