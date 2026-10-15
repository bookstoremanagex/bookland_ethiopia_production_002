-- Run this once to add the indexes the order-approval stock breakdown depends on.
-- The breakdown query filters locked_editions by editionId + status + is_deleted,
-- but that table carries no index at all, so every book in an order triggered a
-- full table scan. These two indexes turn that scan into a range lookup.
--
-- Safe to run on a live database: both are non-blocking on MySQL/InnoDB for
-- tables of this size, and neither changes any data.
--
-- Check first with:
--   SHOW INDEX FROM locked_editions;
--   SHOW INDEX FROM order_items;

CREATE INDEX locked_editions_editionId_status_idx
    ON locked_editions (editionId, status);

-- getAllOrders / getOrderById pull order_items with their bookedition + books for
-- every order in the list; order_items.orderId is unindexed, so that join is a
-- scan per order.
CREATE INDEX order_items_orderId_idx
    ON order_items (orderId);