#!/bin/bash

# Script to copy Kedro pipeline data files to public directory
# This copies projections.json, statements.json, and votes.parquet
# from the specified Kedro pipeline data directory
#
# Usage: ./copy-data.sh [PIPELINE_NAME]
# If no pipeline name is provided, defaults to interactive selection
# Supports file selection and optional suffix for target filenames

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

# Function to select files interactively
select_files_interactive() {
    local files=("projections.json" "statements.json" "votes.parquet")
    local selected_files=()
    
    echo "Available files to copy:" >&2
    for i in "${!files[@]}"; do
        printf "%3d. %s\n" "$((i+1))" "${files[$i]}" >&2
    done
    echo "  4. All files" >&2
    echo "" >&2
    echo "Enter file numbers (1-4) separated by spaces, or press Enter for all files:" >&2
    
    read -r choice
    
    # If empty input (just Enter), select all files
    if [ -z "$choice" ]; then
        selected_files=("${files[@]}")
    else
        # Parse the input
        for num in $choice; do
            if [[ "$num" =~ ^[0-9]+$ ]]; then
                if [ "$num" -eq 4 ]; then
                    # Select all files
                    selected_files=("${files[@]}")
                    break
                elif [ "$num" -ge 1 ] && [ "$num" -le 3 ]; then
                    # Add individual file
                    selected_files+=("${files[$((num-1))]}")
                else
                    echo "Invalid selection: $num. Please enter numbers between 1 and 4." >&2
                    exit 1
                fi
            else
                echo "Invalid input: $num. Please enter numbers only." >&2
                exit 1
            fi
        done
    fi
    
    # Remove duplicates
    local unique_files=()
    for file in "${selected_files[@]}"; do
        if [[ ! " ${unique_files[@]} " =~ " ${file} " ]]; then
            unique_files+=("$file")
        fi
    done
    
    # Return selected files (one per line)
    printf '%s\n' "${unique_files[@]}"
}

# Function to get suffix interactively
get_suffix_interactive() {
    echo "Enter optional suffix for filenames (e.g., 'foo' will create projections.foo.json):" >&2
    echo "Press Enter for no suffix:" >&2
    
    read -r suffix
    
    # Return suffix (empty if none provided)
    echo "$suffix"
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

# Get file selection
echo ""
SELECTED_FILES_OUTPUT=$(select_files_interactive)
SELECTED_FILES=()
while IFS= read -r line; do
    if [ -n "$line" ]; then
        SELECTED_FILES+=("$line")
    fi
done <<< "$SELECTED_FILES_OUTPUT"

# Get suffix
echo ""
SUFFIX=$(get_suffix_interactive)

# Build target filename function
get_target_filename() {
    local source_file="$1"
    local suffix="$2"
    
    if [ -z "$suffix" ]; then
        echo "$source_file"
    else
        # Extract filename and extension
        local filename="${source_file%.*}"
        local extension="${source_file##*.}"
        echo "${filename}.${suffix}.${extension}"
    fi
}

# Copy the selected files
echo ""
echo "Copying files..."
success_count=0
total_count=${#SELECTED_FILES[@]}

for file in "${SELECTED_FILES[@]}"; do
    source_path="$SOURCE_DIR/$file"
    target_filename=$(get_target_filename "$file" "$SUFFIX")
    target_path="$TARGET_DIR/$target_filename"
    
    if [ -f "$source_path" ]; then
        if cp "$source_path" "$target_path"; then
            echo "✓ $file → $target_filename"
            success_count=$((success_count + 1))
        else
            echo "✗ Failed to copy $file"
        fi
    else
        echo "✗ Source file not found: $file"
    fi
done

echo ""
if [ $success_count -eq $total_count ]; then
    echo "Data copy completed successfully! ($success_count/$total_count files copied)"
else
    echo "Data copy completed with errors. ($success_count/$total_count files copied)"
    exit 1
fi