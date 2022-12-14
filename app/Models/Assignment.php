<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Assignment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'assignment';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'asset_id',
        'user_id',
        'admin_id',
        'assigned_date',
        'state',
        'returned_date',
        'returned_id',
        'note',
        'requested_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class, "asset_id")->withTrashed();
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, "admin_id")->withTrashed();
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(User::class, "requested_id")->withTrashed();
    }

    public function scopeFilter($query, $request)
    {
        return $query
            ->when($request->has('filter.state'), function ($query) use ($request) {
                $list = explode(',', $request->query('filter')['state']);
                $query->whereIn('state', $list);
            })
            ->when($request->has('filter.assigned_date'), function ($query) use ($request) {
                $list = explode(',', $request->query('filter')['assigned_date']);
                $query->whereDate('assigned_date', $list);
            })
            ->when($request->has('filter.asset_id'), function ($query) use ($request) {
                $list = explode(',', $request->query('filter')['asset_id']);
                $query->where('asset_id', $list);
            })
            ->when($request->has('filter.returned_date'), function ($query) use ($request) {
                $list = explode(',', $request->query('filter')['returned_date']);
                $query->whereDate('returned_date', $list);
            });
    }

    public function scopeSearch($query, $request)
    {
        $search = $request->query('search');

        return $query
            ->when($request->has('search'), function ($query) use ($search) {
                $query
                    ->whereHas('asset', function ($query) use ($search) {
                        $query->where("asset_code", "ILIKE", "%{$search}%");
                    })
                    ->orWhereHas('asset', function ($query) use ($search) {
                        $query->where("asset_name", "ILIKE", "%{$search}%");
                    })
                    ->orWhereHas('user', function ($query) use ($search) {
                        $query->where("username", "ILIKE", "%{$search}%");
                    });
            });
    }

    public function scopeSort($query, $request)
    {
        return $query
            ->when($request->has("sort"), function ($query) use ($request) {
                $sortBy = '';
                $sortValue = '';

                foreach ($request->query("sort") as $key => $value) {
                    $sortBy = $key;
                    $sortValue = $value ? $value : "asc";
                }

                if ($sortBy === "asset_code" || $sortBy === "asset_name") {
                    $query
                        ->with('asset')
                        ->orderBy(Asset::query()
                            ->select($sortBy)
                            ->whereColumn('id', 'assignment.asset_id'), $sortValue);
                } elseif ($sortBy === "assigned_to") {
                    $query
                        ->with('user')
                        ->orderBy(User::query()
                            ->select('username')
                            ->whereColumn('id', 'assignment.user_id'), $sortValue);
                } elseif ($sortBy === "assigned_by") {
                    $query
                        ->with('admin')
                        ->orderBy(User::query()
                        ->select('username')
                            ->whereColumn('id', 'assignment.admin_id'), $sortValue);
                } elseif ($sortBy !== "id") {
                    $query->orderBy($sortBy, $sortValue);
                }
            });
    }
}
