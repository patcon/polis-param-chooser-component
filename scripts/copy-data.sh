#!/bin/bash

# Script to copy Kedro pipeline data files to public directory
# This copies projections.json, statements.json, and votes.parquet
# from the specified Kedro pipeline data directory
#
# Usage: ./copy-data.sh [PIPELINE_NAME]
# If no pipeline name is provided, defaults to "knn5d_localmap_bestkmeans"

# Function to show interactive pipeline selection
select_pipeline_interactive() {
    local data_dir="$HOME/repos/kedro-polis-pipelines/data"
    local pipelines=()
    local count=0
    
    echo "Available pipelines:" >&2
    
    if [ -d "$data_dir" ]; then
        for pipeline in "$data_dir"/*; do
            if [ -d "$pipeline" ]; then
                local pipeline_name=$(basename "$pipeline")
                local primary_dir="$pipeline/03_primary"
                local projections_file="$primary_dir/projections.json"
                
                if [ -d "$primary_dir" ] && [ -f "$projections_file" ]; then
                    count=$((count + 1))
                    printf "%3d. %s\n" "$count" "$pipeline_name" >&2
                    pipelines+=("$pipeline_name")
                fi
            fi
        done
    fi
    
    if [ $count -eq 0 ]; then
        echo "No valid pipelines found with required data files." >&2
        exit 1
    fi
    
    echo "" >&2
    echo "Enter pipeline number (1-$count) or press Enter to quit:" >&2
    
    read -r choice
    
    # If empty input (just Enter), quit
    if [ -z "$choice" ]; then
        echo "Exiting." >&2
        exit 0
    fi
    
    # Validate numeric input
    if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt $count ]; then
        echo "Invalid selection. Please enter a number between 1 and $count." >&2
        exit 1
    fi
    
    # Return selected pipeline name (only this goes to stdout)
    echo "${pipelines[$((choice-1))]}"
}

# Function to get available pipelines (for error messages)
get_available_pipelines() {
    local data_dir="$HOME/repos/kedro-polis-pipelines/data"
    
    if [ -d "$data_dir" ]; then
        for pipeline in "$data_dir"/*; do
            if [ -d "$pipeline" ]; then
                local pipeline_name=$(basename "$pipeline")
                local primary_dir="$pipeline/03_primary"
                local projections_file="$primary_dir/projections.json"
                
                if [ -d "$primary_dir" ] && [ -f "$projections_file" ]; then
                    echo "$pipeline_name"
                fi
            fi
        done
    fi
}

# If no argument provided, show interactive selection
if [ $# -eq 0 ]; then
    PIPELINE_NAME=$(select_pipeline_interactive)
else
    PIPELINE_NAME="$1"
fi

SOURCE_DIR="$HOME/repos/kedro-polis-pipelines/data/$PIPELINE_NAME/03_primary"
TARGET_DIR="public"

echo "Copying data files from Kedro pipeline: $PIPELINE_NAME"
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory does not exist: $SOURCE_DIR"
    echo ""
    echo "Available pipelines:"
    get_available_pipelines | sed 's/^/  /'
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