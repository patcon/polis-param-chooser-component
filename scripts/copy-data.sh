#!/bin/bash

# Script to copy Kedro pipeline data files to public directory
# This copies projections.json, statements.json, and votes.parquet
# from the specified Kedro pipeline data directory

PIPELINE_NAME="knn5d_localmap_bestkmeans"
SOURCE_DIR="$HOME/repos/kedro-polis-pipelines/data/$PIPELINE_NAME/03_primary"
TARGET_DIR="public"

echo "Copying data files from Kedro pipeline: $PIPELINE_NAME"
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory does not exist: $TARGET_DIR"
    exit 1
fi

# Copy the files
echo "Copying files..."
cp "$SOURCE_DIR/projections.json" "$TARGET_DIR/" && echo "✓ projections.json copied"
cp "$SOURCE_DIR/statements.json" "$TARGET_DIR/" && echo "✓ statements.json copied"
cp "$SOURCE_DIR/votes.parquet" "$TARGET_DIR/" && echo "✓ votes.parquet copied"

echo "Data copy completed successfully!"