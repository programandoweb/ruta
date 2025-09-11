<?php

namespace App\Contracts;

interface RawMaterialsRepositoryInterface
{
    public function getAll($request);
    public function findById($id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}
