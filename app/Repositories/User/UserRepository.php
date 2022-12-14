<?php

namespace App\Repositories\User;

use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;

class UserRepository
{
    protected int $paginate = 20;

    public function getAllUser($request)
    {
        $data = User::query()
            ->select(
                "id",
                "user.staff_code",
                "user.type",
                "user.last_name",
                "user.first_name",
                "user.full_name",
                "user.username",
                "user.joined_date"
            )
            ->filter($request)
            ->sort($request)
            ->search($request)
            ->where("id", "!=", auth()->id())
            ->where("location_id", "=", auth()->user()->location_id)
            ->paginate($this->paginate);

        return UserResource::collection($data)->response()->getData();
    }

    public function store($request)
    {
        $request['full_name'] = "";
        $request['staff_code'] = "";
        $request['username'] = "";
        $request["password"] = "";
        $user = User::query()->create($request);
        return User::query()->find($user["id"]);
    }

    public function getUserById($id)
    {
        $data = User::query()
            ->find($id);

        return UserResource::make($data);
    }

    public function handleUpdateUser($request, $id)
    {
        $user = User::query()->where('id', '=', $id)->first();
        $user->update($request->all());
        return $user;
    }

    public function delete($id)
    {
        $user = User::query()->find($id);
        if ($user) {
            $user->delete();
            return response()->json(
                [
                    "status" => true,
                    "message" => "User disabled",
                ],
                200
            );
        }
    }

    public function checkAssignmentExits($id)
    {
        $user = User::query()->find($id);
        if ($user->assignment()->whereNotIn('state', array("Completed", "Declined"))->exists()) {
            return response()->json(
                [
                    "success" => true,
                    "message" =>
                        "There are valid assignments belonging to this user.",
                ],
                200
            );
        } else {
            return response()->json(
                [
                    "success" => true,
                    "message" => "User can be disabled"
                ],
                200
            );
        }
    }
}
