cursor = db.school.aggregate([
	{ $unwind: '$scores' },
	{ $match: { 'scores.type': 'homework' }},
	{ $group: { _id: '$_id', minscore: { $min: '$scores.score' } } }
]);

cursor.forEach(function (coll) {
	db.school.update({
		_id: coll._id,
	}, {
		$pull: {
			'scores': {
				type: 'homework',
				score: coll.minscore
			}
		}
	});
});

agrigation = db.school.aggregate([
	{ $unwind: '$scores' },
	{ $group: { _id: '$_id', avgscore: { $avg: '$scores.score' } } },
	{ $sort: { avgscore: -1 } },
	{ $limit: 1 }
]).toArray();

print(agrigation[0]['_id']);
