<?php

namespace App\Repositories;

use App\Models\Business;
use App\Models\BusinessGallery;
use Illuminate\Http\Request; // Not strictly needed here, but kept for context
use Illuminate\Support\Facades\DB;


class UserBusinessRepository
{
    public function findById($id)
    {
        return Business::where("user_id", $id)->first();
    }

    public function getGallery($id)
    {
        // This method seems to have a logical error.
        // It's trying to get a gallery based on 'business_id' from the 'Business' model,
        // but 'Business' represents a single business.
        // If this is for a business's images, it should likely be a relationship
        // or a separate 'BusinessImage' model.
        // For now, assuming it's not directly related to the 'updateOrCreate' problem.
        return BusinessGallery::where("business_id",$id)
                              ->pluck('image_path') // Pluck only the 'image_path' column
                              ->all();
    }

    public function updateOrCreate(int $userId, array $validated)
    {
        $updates=[
                'name'              => $validated['name'],
                'location'          => $validated['location'] ?? null,
                'contact_phone'     => $validated['contact_phone'] ?? null,
                'contact_email'     => $validated['contact_email'] ?? null, // Add this
                'whatsapp_link'   => $validated['whatsapp_link'] ?? null, // Add this
                'price'           => $validated['price'] ?? null, // Add this
                'unit'            => $validated['unit'] ?? null, // Add this
                'description'     => $validated['description'] ?? null,
                'category_id'     => $validated['category_id'],
                'allow_comments'  => $validated['allow_comments'] ?? false,
                'allow_location'  => $validated['allow_location'] ?? false,
                'is_active'       => true, // Assuming it's always active upon update/create
        ];
        //p($updates);
        return Business::updateOrCreate(
            ['user_id' => $userId],
            $updates
        );
    }

    /**
     * Updates or creates gallery images for a given business.
     *
     * This function synchronizes the gallery images for a business based on the provided array of image URLs.
     * It adds new images, removes old ones, and updates existing ones if necessary (though with no 'order' field,
     * the order from the frontend array isn't preserved in the DB directly for existing entries).
     *
     * @param int $businessId The ID of the business.
     * @param array $galleryData An array of image URLs (strings) from the frontend.
     * @return void
     */
    public function updateOrCreateGallery(int $businessId, array $galleryData): void
    {
        DB::transaction(function () use ($businessId, $galleryData) {
            // 1. Get ALL existing gallery images for the business as a Collection of models
            $existingGalleries = BusinessGallery::where('business_id', $businessId)->get();

            // 2. Extract existing image paths into a simple array for easier checking
            $existingImagePaths = $existingGalleries->pluck('image_path')->all();

            // 3. Determine which existing images should be kept (based on paths in incoming data)
            $pathsToKeep = [];
            $idsToDelete = []; // IDs of existing records that are no longer in incoming data

            // First, identify IDs of images that are *not* in the new galleryData
            foreach ($existingGalleries as $existingGallery) {
                if (!in_array($existingGallery->image_path, $galleryData)) {
                    $idsToDelete[] = $existingGallery->id;
                }
            }

            // Second, identify images to add (those in incoming data but not in existing)
            $pathsToAdd = [];
            foreach ($galleryData as $incomingImagePath) {
                if (!in_array($incomingImagePath, $existingImagePaths)) {
                    $pathsToAdd[] = $incomingImagePath;
                }
            }

            // 4. Perform deletions
            if (!empty($idsToDelete)) {
                BusinessGallery::whereIn('id', $idsToDelete)->delete();
            }

            // 5. Create new gallery entries
            foreach ($pathsToAdd as $newImagePath) {
                BusinessGallery::create([
                    'business_id' => $businessId,
                    'image_path' => $newImagePath,
                    'caption' => null, // Assuming no caption is sent from frontend, it will be null
                ]);
            }

            // Optional: If you need to reorder existing items or update captions,
            // you'd iterate through $galleryData again and find/update existing records by image_path
            // or by a unique identifier if your frontend provided one.
            // Since there's no 'order' column and frontend sends only URLs, this is sufficient.
        });
    }
}